const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// =======================
// 🔥 CORS (IMPORTANT FIX)
// =======================
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
}));

// =======================
// Uploads folder ensure
// =======================
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// =======================
// Multer config
// =======================
const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

// =======================
// Test route
// =======================
app.get('/', (req, res) => {
  res.send('✅ PDF Backend is running');
});

// =======================
// Convert API
// =======================
app.post('/api/convert', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // 👉 Abhi mock conversion (future me real logic)
  res.json({
    success: true,
    fileId: req.file.filename,
  });
});

// =======================
// Download API
// =======================
app.get('/api/download/:id', (req, res) => {
  const filePath = path.join(uploadDir, req.params.id);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  res.download(filePath, 'converted.pdf');
});

// =======================
// Start server
// =======================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
