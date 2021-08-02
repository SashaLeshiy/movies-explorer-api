require('dotenv').config();

const {
  PORT = 3000,
  MONGO_URI = 'mongodb://localhost:27017/bitfilmsdb',
  JWT_SECRET = 'jwt-secret-token',
} = process.env;

module.exports = {
  PORT,
  MONGO_URI,
  JWT_SECRET,
};
