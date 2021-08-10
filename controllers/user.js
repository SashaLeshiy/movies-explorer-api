const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET } = require('../config');

module.exports.getUser = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then((user) => {
      if (!user) {
        const err = new Error('Пользователь не найден');
        err.statusCode = 404;
        next(err);
      } else {
        res.send({
          name: user.name, email: user.email,
        });
      }
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
    }))
    .then((user) => res.send({
      name: user.name, email: user.email, id: user.id,
    }))
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        const error = new Error('Данные емейл зарегистрирован');
        error.statusCode = 409;
        next(error);
      }
      next(err);
    });
};

module.exports.changeProfile = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { runValidators: true, new: true })
    .then((profile) => {
      if (!profile) {
        const err = new Error('Пользователь не найден');
        err.statusCode = 404;
        next(err);
      } else {
        res.send({
          email: profile.email, name: profile.name,
        });
      }
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password, next)
    .then((user) => {
      if (!user) {
        const err = new Error('Неверно указаны почта или пароль');
        err.statusCode = 401;
        next(err);
      } else {
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
        res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true }).send({ token });
      }
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.signout = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then((user) => {
      if (!user) {
        const err = new Error('Пользователь не найден');
        err.statusCode = 404;
        next(err);
      } else {
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '1ms' });
        res.cookie('jwt', token, { maxAge: 60, httpOnly: true }).send('Вы вышли');
      }
    })
    .catch((err) => {
      next(err);
    });
};
