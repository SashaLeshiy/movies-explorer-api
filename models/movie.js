const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: [validator.isURL, 'Не валидный url'],
  },
  trailer: {
    type: String,
    required: true,
    validate: [validator.isURL, 'Не валидный url'],
  },
  thumbnail: {
    type: String,
    required: true,
    validate: [validator.isURL, 'Не валидный url'],
  },
  movieId: {
    type: String,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.ObjectId,
    ref: 'user',
    required: true,
  },
});
module.exports = mongoose.model('movie', movieSchema);
