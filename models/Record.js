const mongoose = require('../libs/mongoose');
const pick = require('lodash/pick');

const publicFields = ['videoId', 'title', 'imageUrl'];

const recordSchema = new mongoose.Schema({
  videoId: {
    type: String,
    required: 'videoId is required',
    unique: true
  },
  title: {
    type: String
  },
  imageUrl: {
    type: String
  }
}, {
  timestamps: true,
  toObject: {
    transform(doc, ret, options) {
      return pick(ret, [...publicFields, '_id']);
    }
  }
});

recordSchema.statics.publicFields = publicFields;

module.exports = mongoose.model('Record', recordSchema);
