const mongoose = require('mongoose');
const config = require('config');

mongoose.set('debug', config.get('mongodb.debug'));
mongoose.connect(config.get('mongodb.uri'), {
  useNewUrlParser: true,
  useCreateIndex: true
});

module.exports = mongoose;
