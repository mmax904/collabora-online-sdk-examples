const fs = require('fs').promises;
const StreamZip = require('node-stream-zip');
const JSZip = require('jszip');
const xml2js = require('xml2js');

module.exports = {

    open: function(filePath) {
        return new Promise(
            function(resolve, reject) {
                const zip = new StreamZip({
                    file: filePath,
                    storeEntries: true
                })

                zip.on('ready', () => {
                    var chunks = []
                    var content = ''
                    zip.stream('word/document.xml', (err, stream) => {
                        if (err) {
                            reject(err)
                        }
                        stream.on('data', function(chunk) {
                            chunks.push(chunk)
                        })
                        stream.on('end', function() {
                            content = Buffer.concat(chunks)
                            zip.close()
                            resolve(content.toString())
                        })
                    })
                })
            }
        )
    },

    extract: function(filePath) {
        return new Promise(
            function(resolve, reject) {
                module.exports.open(filePath).then(function (res, err) {
                    if (err) { 
                        reject(err) 
                    }

                    var body = ''
                    var components = res.toString().split('<w:t')
                    console.log(components)

                    for(var i=0;i<components.length;i++) {
                        var tags = components[i].split('>')
                        var content = tags[1].replace(/<.*$/,"")
                        body += content+' '
                    }

                    resolve(body)
                })
            }
        )
    },

    modifyDocxText: async function (filePath) {
        const data = await fs.readFile(filePath);
        const zip = await JSZip.loadAsync(data);
        const xmlStr = await zip.file('word/document.xml').async('string');
        // await fs.writeFile('./docx.xml', xmlStr);
        const parser = new xml2js.Parser({
            // explicitChildren: true, // for adding #name key, causing issue with buildObject
            // preserveChildrenOrder: true, // for adding #name key, causing issue with buildObject
            // xmlns: true  // true if supporting namesace $ns key, causing issue with buildObject
        });
        const doc = await parser.parseStringPromise(xmlStr);
    
        // Example modification: appending text to text nodes
        const appendTextToNodes = (obj) => {
            if (obj.hasOwnProperty('$$')) {
                obj.$$.forEach(child => {
                    if (child['#name'] === 'w:t') {
                        child._ += ' - Modified'; // Append note
                    } else {
                        appendTextToNodes(child);
                    }
                });
            }
        };
        appendTextToNodes(doc);
        // console.log(JSON.stringify(doc))
        
        // await fs.writeFile('./docx.json', JSON.stringify(doc));
        const builder = new xml2js.Builder({
            headless: true,
            allowSurrogateChars: true,
        });

        // console.log(doc['w:document'].$$[0].$$[0])
        
        const newXmlStr = builder.buildObject(doc);
        
        zip.file('word/document.xml', newXmlStr);
    
        const content = await zip.generateAsync({type: 'nodebuffer'});
        await fs.writeFile('./utils/docx/docx_modified.docx', content);
        console.log('Document successfully modified.');
    }

}

return module.exports

