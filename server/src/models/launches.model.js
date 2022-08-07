const launchesDB = require('./launches.mongo');
const planets = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;
const launch = {
  flightNumber: 100,
  mission: 'Kepler Exploration X',
  rocket: 'Explorer IS1',
  launchDate: new Date('December 12, 2030'),
  target: 'Kepler-442 b',
  customers: ['NASA', 'SpaceX', 'Google'],
  upcoming: true,
  success: true,
};

saveLaunch(launch);
async function getAllLaunches() {
  return await launchesDB.find({}, { _id: 0, __v: 0 });
}

async function saveLaunch(launch) {
  const planet = await planets.findOne({ keplerName: launch.target });
  if (!planet) {
    throw new Error('Planet not found');
  }
  await launchesDB.findOneAndUpdate(
    { flightNumber: launch.flightNumber }, // finding the data if the data is exist or not
    launch, // the data that we want to update
    { upsert: true }
  );
}
async function scheduleNewLaunch(launch) {
  const newFlightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
    flightNumber: newFlightNumber,
    upcoming: true,
    success: true,
    customers: ['NASA', 'SpaceX', 'Google'],
  });

  await saveLaunch(newLaunch);
}

async function existLaunchWithId(launchId) {
  return await launchesDB.findOne({ flightNumber: launchId });
}

async function getLatestFlightNumber() {
  const latestLaunch = await launchesDB.findOne().sort('-flightNumber');

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;
}

async function abortLaunchById(launchId) {
  const aborted = await launchesDB.updateOne(
    { flightNumber: launchId },
    { $set: { success: false, upcoming: false } }
  );
  return aborted.modifiedCount === 1;
}

module.exports = {
  getAllLaunches,
  scheduleNewLaunch,
  existLaunchWithId,
  abortLaunchById,
};
