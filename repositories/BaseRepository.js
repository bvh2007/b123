const mongoose = require('mongoose');

/** Lớp cha chứa các thao tác CRUD chung cho mọi collection. */
class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  isValidId(id) {
    return mongoose.isValidObjectId(id);
  }

  async create(data) {
    return this.model.create(data);
  }

  async findById(id) {
    if (!this.isValidId(id)) return null;
    return this.model.findById(id);
  }

  async deleteById(id) {
    return this.model.findByIdAndDelete(id);
  }
}

module.exports = BaseRepository;
