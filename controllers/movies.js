const Movie = require('../models/movie');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch((err) => {
      next(err);
    });
};

module.exports.getCardId = (req, res, next) => {
  Movie.findById(req.params.id)
    .then((card) => {
      if (!card) {
        const err = new Error('Не найдено');
        err.statusCode = 404;
        next(err);
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        const err = new Error('Не найдено');
        err.statusCode = 404;
        next(err);
      }
      return movie;
    })
    .then((movie) => {
      if (JSON.stringify(movie.owner) !== JSON.stringify(req.user._id)) {
        const err = new Error('Нет доступа');
        err.statusCode = 403;
        next(err);
      } else {
        Movie.findByIdAndRemove(req.params.movieId)
          .then(() => {
            res.send({ message: `Фильм ${req.params.movieId} удален` });
          })
          .catch(() => {
            next();
          });
      }
    })
    .catch(() => {
      next();
    });
};
