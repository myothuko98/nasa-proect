const mongoose = require('mongoose');

const PlanetsSchema = new mongoose.Schema({
  keplerName: { type: String, required: true },
});

//connect PlanetsSchema to the planets collection in the database
module.exports = mongoose.model('Planet', PlanetsSchema);