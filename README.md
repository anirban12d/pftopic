### This is the next js example of PDFtoPic

There is a form in the main page component where it takes a PDF as an input and then converts the first page of the PDF to an image and downloads the image.

## The package used

- [mozilla/pdf.js](https://github.com/mozilla/pdf.js)

To be able to use this in the next js project the next.config.mjs file has to be modified the way it is done in this repo.

The **PDFConverter.js** file holds the logic to convert the first page of a PDF to an image.
