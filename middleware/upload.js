const multer = require('multer');
const path = require('path');
const AppError = require('../utils/AppError');

/** Cấu hình upload file: chỉ nhận PDF/DOC/DOCX, giới hạn dung lượng. */
class UploadMiddleware {
  constructor({ dir, allowedExtensions, maxFileSize }) {
    this.allowedExtensions = allowedExtensions;
    this.multer = multer({
      storage: multer.diskStorage({
        destination: dir,
        filename: (req, file, cb) => cb(null, this.buildFileName(file.originalname)),
      }),
      limits: { fileSize: maxFileSize },
      fileFilter: (req, file, cb) => this.checkFile(file, cb),
    });
  }

  buildFileName(originalName) {
    return Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(originalName).toLowerCase();
  }

  checkFile(file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (this.allowedExtensions.includes(ext)) return cb(null, true);
    cb(new AppError('Chỉ chấp nhận file PDF, DOC hoặc DOCX', 400));
  }

  single(fieldName) {
    return this.multer.single(fieldName);
  }
}

module.exports = UploadMiddleware;
