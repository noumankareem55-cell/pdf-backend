const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

/* CORS */
app.use(cors());
app.options('*', cors());

/* uploads folder ensure */
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

/* multer config */
const upload = multer({ dest: uploadDir });

/* test */
app.get('/', (req, res) => {
  res.send('PDF Backend is running');
});

/* upload */
app.post('/api/convert', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // IMPORTANT: original filename save karo
  res.json({
    fileId: req.file.filename,
    originalName: req.file.originalname
  });
});

/* download */
app.get('/api/download/:id', (req, res) => {
  const filePath = path.join(uploadDir, req.params.id);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('File not found');
  }

  res.setHeader(
    'Content-Disposition',
    'attachment; filename="converted.pdf"'
  );

  res.setHeader('Content-Type', 'application/pdf');

  fs.createReadStream(filePath).pipe(res);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
