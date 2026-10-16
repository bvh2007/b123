const fs = require('fs');
const path = require('path');

/** Làm việc với file trong thư mục uploads. */
class FileStorage {
  constructor(dir) {
    this.dir = dir;
    fs.mkdirSync(this.dir, { recursive: true });
  }

  pathOf(fileName) {
    return path.join(this.dir, fileName);
  }

  remove(filePath) {
    fs.unlink(filePath, () => {}); // bỏ qua lỗi nếu file không còn
  }

  /** multer đọc tên file tiếng Việt sai font -> chuyển lại về UTF-8. */
  static fixVietnameseName(name) {
    return Buffer.from(name, 'latin1').toString('utf8');
  }
}

module.exports = FileStorage;
