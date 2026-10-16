const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subject: { type: String, trim: true, default: 'Khác' },
    description: { type: String, trim: true, default: '' },
    fileName: { type: String, required: true },     // tên file lưu trong uploads
    filePath: { type: String, required: true },     // ví dụ: uploads/abc.pdf
    originalName: { type: String, required: true }, // tên file gốc
    fileSize: { type: Number, required: true },
    downloads: { type: Number, default: 0 },
    uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Document', documentSchema);
