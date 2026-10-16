/** Escape ký tự đặc biệt để dùng chuỗi người dùng nhập trong RegExp an toàn. */
module.exports = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
