/** Bọc hàm async của controller để lỗi tự chuyển sang ErrorHandler. */
module.exports = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
