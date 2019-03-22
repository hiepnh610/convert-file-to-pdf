const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const doc = new PDFDocument({
  size: "A4",
  margins: {
    top : 30,
    bottom : 30,
    left : 30,
    right : 30
  }
});

const rootName = 'dirname/';

doc.pipe(fs.createWriteStream('output.pdf'));
doc.registerFont('arial', path.join(__dirname + '/Arial.ttf'));
doc.font('arial');

delete doc._fontFamilies['ArialUnicodeMS'];

const createPdfFile = (dirname, textContent) => {
  const nameFile = path.basename(dirname);

  doc
  .fontSize(18)
  .text(nameFile, 30, 30);

  doc
  .fontSize(12)
  .text(textContent, 30, 60);

  doc
  .addPage();
};

const loopThroughFolder = (dirname, path) => {
  for (file of dirname) {
    let filePwd = `${path}${file}`;

    fs.lstat(filePwd, (err, stat) => {
      if (err) return;

      if (stat.isFile()) {
        fs.readFile(filePwd, 'utf8', (err, buf) => {
          if (err) return;

          createPdfFile(filePwd, buf.toString())
        });
      } else {
        const newFilePwd = `${filePwd}/`
        readFileInDir(newFilePwd);
      }
    });
  }
};

const readFileInDir = (dirName) => {
  fs.readdir(dirName, (err, filenames) => {
    if (err) return;

    const excludeFile = filenames.filter((file) => {
      return file !== 'node_modules';
    });

    loopThroughFolder(excludeFile, dirName);
  });
}

readFileInDir(rootName);

setTimeout(() => {
  doc.end();
}, 3000);
