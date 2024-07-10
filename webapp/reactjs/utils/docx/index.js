var docx = require('./docx')

// docx.extract('/Users/manish/Documents/Redlined-Contract-Document.docx').then(function(res, err) {
//     if (err) {
//         console.log(err)
//     }
//     console.log(res)
// })

docx.modifyDocxText('/Users/manish/Documents/Redlined-Contract-Document.docx')
