const router = require('express').Router();
const cors = require('cors');
const { celebrate, Joi } = require('celebrate');
const user = require('./users');
const movie = require('./movie');
const { login, createUser } = require('../controllers/user');
const auth = require('../middlewares/auth');

router.post('/signin', cors(), celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
}), createUser);

router.use(auth);
router.use('/', user);
router.use('/', movie);

router.use((req, res, next) => {
  const err = new Error('Hе найдено');
  err.statusCode = 404;
  next(err);
});

module.exports = router;
