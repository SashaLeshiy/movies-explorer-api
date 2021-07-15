const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routers = require('./routes/index');
const errorHandler = require('./middlewares/error-handler');

require('dotenv').config();

const { PORT = 3000, MONGO_URI = 'mongodb://localhost:27017' } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(requestLogger);

app.use(cors({
  origin: [
    'http://zomlesh.nomoredomains.club',
    'https://zomlesh.nomoredomains.club',
    'http://localhost:3000',
  ],
  credentials: true,
}));

app.use(routers);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Сервер на порту ${PORT}`);
});
