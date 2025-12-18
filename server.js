const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// 🔥 CORS ENABLE (MOST IMPORTANT)
app.use(cors());

// Upload folder
const upload = multer({ dest: 'uploads/' });

// Test route
app.get('/', (req, res) => {
  res.send('PDF Backend is running');
});

// Convert route
app.post('/api/convert', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // For now we just return fileId (mock conversion)
  res.json({ fileId: req.file.filename });
});

// Download route
app.get('/api/download/:id', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.id);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('File not found');
  }

  res.download(filePath, 'converted.pdf');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
