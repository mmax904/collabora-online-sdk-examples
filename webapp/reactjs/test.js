const WordExtractor = require("word-extractor");

const extractor = new WordExtractor();
const extracted = extractor.extract('/Users/manish/Documents/6 River Systems, LLC_20220617_MASTER FULFILLMENT MANAGEMENT SYSTEM AGREEMENT 1.docx')
.then((dd) => {
    console.log(dd._body)
});