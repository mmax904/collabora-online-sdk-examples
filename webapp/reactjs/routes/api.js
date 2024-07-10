const fs = require('fs');
const path = require('path');
var express = require('express');
const multer = require('multer');
const mammoth = require('mammoth');
const DiffMatchPatch = require('diff-match-patch');

// const docx = require('docx');
// const Docxtemplater = require('docxtemplater');

// const {PDFDocument} = require('pdf-lib'); // not for extracting text

// const pdfjsLib = require('pdfjs-dist'); // will work with es6


// const PDFExtract = require('pdf-text-extract'); // works with file path
const requireEsm = require('esm')


var router = express.Router();
const upload = multer();

function getFileType(fileInfo) {
    // Implement logic to identify file type based on buffer contents (e.g., magic numbers)
    if (
        fileInfo.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
        fileInfo.originalname.endsWith('.docx') || 
        fileInfo.originalname.endsWith('.doc')
    ) {
        return 'docx';
    }
    else if (
        fileInfo.mimetype === 'application/pdf' || 
        fileInfo.originalname.endsWith('.docx') || 
        fileInfo.originalname.endsWith('.doc')
    ) {
        return 'pdf';
    } 
    else {
        throw new Error('Unsupported file format');
    }
}

function createDiff(textA, textB) {
    // Use a diff library (e.g., diff-match-patch) to generate the diff
    
    const dmp = new DiffMatchPatch();
    const diff = dmp.diff_main(textA, textB);
    dmp.diff_cleanupSemantic(diff);
    const diffHtml = dmp.diff_prettyHtml(diff);
    return diffHtml;
}

async function extractText(file) {
    const buffer = file.buffer;
    const mimetype = file.mimetype;
    const originalname = file.originalname;
    const fileType = getFileType({ mimetype, originalname }); // Function to determine file type (DOCX or PDF)

    if (fileType === 'docx') {
        // const doc = await docx.Document.fromBuffer(buffer);
        // const paragraphs = doc.getBody().getChildElements();
        // return paragraphs.reduce((text, p) => text + p.getText(), '');

        // const docx = new Docxtemplater(file.buffer);
        // const rendered = await docx.render();
        // return rendered.output;

        const result = await mammoth.extractRawText({ buffer });
        return result.value;
    } else if (fileType === 'pdf') {
        // const pdfDoc = await PDFDocument.load(buffer);
        // const pages = await pdfDoc.getPages();
        // console.log(pages[0])
        // const text = pages.reduce(async (text, page) => text + await page.getTextContent(), '');
        // return text;

        return await (async () => {
            const pdfjs = await requireEsm('pdfjs-dist', {});
            // Use pdfjs here
            const pdfDoc = pdfjsLib.getDocument({ data: buffer });
            const numPages = pdfDoc._pdfInfo.numPages;
            let text = '';
    
            // Extract text from all pages of the PDF
            for (let i = 1; i <= numPages; i++) {
                const page = await pdfDoc.getPage(i);
                const textContent = await page.getTextContent();
                text += textContent.items.map(item => item.str).join('\n'); // Combine text from each page
            }
            return text;
        })();

        // const pdfDoc = pdfjsLib.getDocument({ data: buffer });
        // const numPages = pdfDoc._pdfInfo.numPages;
        // let text = '';

        // // Extract text from all pages of the PDF
        // for (let i = 1; i <= numPages; i++) {
        //     const page = await pdfDoc.getPage(i);
        //     const textContent = await page.getTextContent();
        //     text += textContent.items.map(item => item.str).join('\n'); // Combine text from each page
        // }

        // const text = await PDFExtract(file.buffer);
        // return text.join('\n'); // Combine extracted pages
    } else {
        throw new Error('Unsupported file format');
    }
}

router.post('/compare/docs', upload.fields([{ name: 'fileA' }, { name: 'fileB' }]), async (req, res) => {
    const { fileA, fileB } = req.files;

    try {
        const textA = await extractText(fileA[0]);
        const textB = await extractText(fileB[0]);

        const diff = createDiff(textA, textB);

        res.json({ diff, textA, textB });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error comparing files');
    }
});

router.post('/extract/data', upload.fields([{ name: 'fileA' }]), async (req, res) => {
    const { fileA } = req.files;

    try {
        const { buffer } = fileA[0];

        const result = await mammoth.convertToHtml({ buffer });

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error comparing files');
    }
});

module.exports = router;