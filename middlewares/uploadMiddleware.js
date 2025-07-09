const multer = require("multer");
const path = require("path");

// Lokasi penyimpanan file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // folder uploads/
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName);
  },
});

// Validasi file: hanya .jpg, .png, .jpeg
const fileFilter = (req, file, cb) => {
  const allowed = /jpg|jpeg|png/;
  const extname = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowed.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Hanya file gambar (jpg, jpeg, png) yang diperbolehkan!"));
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
