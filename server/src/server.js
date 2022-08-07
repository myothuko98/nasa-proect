const http = require('http');
const mongoose = require('mongoose');
const app = require('./app');
const { loadPlanetsData } = require('./models/planets.model');

const PORT = process.env.PORT || 8000;

const MONGO_URL =
  'mongodb+srv://myothuko:Q5EBvDbadWZXblTy@cluster0.tz65xlo.mongodb.net/?retryWrites=true&w=majority';

const server = http.createServer(app);

mongoose.connection.once('open', () => {
  console.log('MongoDB connected');
});

mongoose.connection.on('error', (err) => {
  console.error(err);
});

async function startServer() {
  //connect mongodb using mongoose
  await mongoose.connect(MONGO_URL);
  await loadPlanetsData();

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT} ...`);
  });
}

startServer();
