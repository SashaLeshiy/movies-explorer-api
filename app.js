const express = require('express');
const helmet = require('helmet');
// const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { PORT, MONGO_URI } = require('./config');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routes = require('./routes');
const error = require('./middlewares/error-handler');

const app = express();

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(requestLogger);

// app.use(cors({
//   origin: [
//     'http://zomlesh.nomoredomains.club',
//     'https://zomlesh.nomoredomains.club',
//     'http://localhost:3000',
//   ],
//   credentials: true,
// }));

app.use(routes);

app.use(errorLogger);

app.use(errors());

app.use(error);

app.listen(PORT, () => {
  console.log(`Сервер на порту ${PORT}`);
});
