const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    validate: [validator.isEmail, 'Емейл не валиден'],
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
  },
});

userSchema.statics.findUserByCredentials = function compareDataUser(email, password, next) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        const err = new Error('Неправильные почта или пароль');
        err.statusCode = 401;
        next(err);
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            const err = new Error('Неправильные почта или пароль');
            err.statusCode = 401;
            next(err);
          }
          return user;
        });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = mongoose.model('user', userSchema);
