const mongoose = require('mongoose');

const MONGO_URL =
  'mongodb+srv://myothuko:Q5EBvDbadWZXblTy@cluster0.tz65xlo.mongodb.net/?retryWrites=true&w=majority';

mongoose.connection.once('open', () => {
  console.log('MongoDB connected');
});

mongoose.connection.on('error', (err) => {
  console.error(err);
});

async function mongoConnect() {
  mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
  mongoose.disconnect();
}

module.exports = {
  mongoConnect,
  mongoDisconnect,
};
