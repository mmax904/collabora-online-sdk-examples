const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const JSZip = require('jszip');
const { JSDOM } = require('jsdom');
const AWS = require('aws-sdk');

const app = express();

// Enable express-fileupload middleware
app.use(fileUpload());

// Configure AWS SDK
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

// Function to add custom properties to Word document
async function addCustomProperty(buffer, properties) {
    const zip = await JSZip.loadAsync(buffer);
    const customPropsPath = 'docProps/custom.xml';
    let customPropsXml;

    if (zip.files[customPropsPath]) {
        customPropsXml = await zip.files[customPropsPath].async('string');
    } else {
        customPropsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/custom-properties"
                    xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
        </Properties>`;
    }

    const dom = new JSDOM(customPropsXml, { contentType: 'text/xml' });
    const document = dom.window.document;
    const propertiesNode = document.querySelector('Properties');
    let propId = 2;

    properties.forEach(({ name, value }) => {
        const propNode = document.createElementNS(
            'http://schemas.openxmlformats.org/officeDocument/2006/custom-properties',
            'property'
        );
        propNode.setAttribute('name', name);
        propNode.setAttribute('fmtid', '{D5CDD505-2E9C-101B-9397-08002B2CF9AE}');
        propNode.setAttribute('pid', propId++);
        const valueNode = document.createElementNS(
            'http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes',
            'vt:lpwstr'
        );
        valueNode.textContent = value;
        propNode.appendChild(valueNode);
        propertiesNode.appendChild(propNode);
    });

    const serializer = new dom.window.XMLSerializer();
    const updatedXml = serializer.serializeToString(document);
    zip.file(customPropsPath, updatedXml);

    return await zip.generateAsync({ type: 'nodebuffer' });
}

// API endpoint
app.post('/upload', async (req, res) => {
    try {
        if (!req.files || !req.files.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const uploadedFile = req.files.file;

        // Add custom properties to the uploaded document
        const customProperties = [
            { name: 'UploadedBy', value: 'User123' },
            { name: 'UploadDate', value: new Date().toISOString() },
        ];
        const updatedBuffer = await addCustomProperty(uploadedFile.data, customProperties);

        // Upload the updated file to S3
        const s3Params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `documents/${uploadedFile.name}`, // Adjust path as needed
            Body: updatedBuffer,
            ContentType: uploadedFile.mimetype,
        };

        const uploadResult = await s3.upload(s3Params).promise();

        res.status(200).json({
            message: 'File uploaded successfully',
            s3Url: uploadResult.Location,
        });
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).json({ error: 'Failed to upload file' });
    }
});

// curl -X POST -F "file=@path_to_your_docx.docx" http://localhost:3000/upload

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
