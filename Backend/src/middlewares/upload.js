const multer = require('multer');
const path = require('path');

// Konfigurasi storage untuk multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/bukti-transaksi/');
  },
  filename: function (req, file, cb) {
    // Generate nama file unik dengan timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'bukti-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Konfigurasi storage untuk gambar campaign
const campaignImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/campaign-images/');
  },
  filename: function (req, file, cb) {
    // Generate nama file unik dengan timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'campaign-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filter file yang diizinkan
const fileFilter = (req, file, cb) => {
  // Hanya izinkan file gambar
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar yang diizinkan!'), false);
  }
};

// Konfigurasi multer untuk bukti transaksi
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Maksimal 5MB
  }
});

// Konfigurasi multer untuk gambar campaign
const uploadCampaignImage = multer({
  storage: campaignImageStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Maksimal 5MB
  }
});

// Middleware untuk handle error upload
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'Ukuran file terlalu besar. Maksimal 5MB' });
    }
    return res.status(400).json({ message: 'Error saat upload file' });
  } else if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};

module.exports = { upload, uploadCampaignImage, handleUploadError }; 