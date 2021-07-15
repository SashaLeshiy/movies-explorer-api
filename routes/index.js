const routers = require('express').Router;
const cors = require('cors');
const { celebrate, Joi } = require('celebrate');
const user = require('./users');
const movie = require('./movie');
const { login, createUser } = require('../controllers/user');
const auth = require('../middlewares/auth');

routers.post('/signin', cors(), celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

routers.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/^(http|https):\/\/(www\.)?([\da-z.-]+)\.([a-z.]{2,6})([/\w\-._~:/?#[\]@!$&'()*+,;=]*)*#?$/),
  }),
}), createUser);

routers.use(auth);
routers.use('/', user);
routers.use('/', movie);

routers.use((req, res, next) => {
  const err = new Error('Hе найдено');
  err.statusCode = 404;
  next(err);
});

module.exports = routers;
