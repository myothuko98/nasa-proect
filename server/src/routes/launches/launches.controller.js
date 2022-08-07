const {
  getAllLaunches,
  existLaunchWithId,
  abortLaunchById,
  scheduleNewLaunch,
} = require('../../models/launches.model');

async function httpGetAllLaunches(req, res) {
  res.status(200).json(await getAllLaunches());
}

async function httpAddNewLaunch(req, res) {
  const launch = req.body;

  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      error: 'Missing required fields',
    });
  }

  launch.launchDate = new Date(launch.launchDate);

  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: 'Invalid launch date',
    });
  }
  await scheduleNewLaunch(launch);
  console.log(launch);
  // const newLaunch = await scheduleNewLaunch(launch);

  return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
  const id = +req.params.id;
  const existLaunch = await existLaunchWithId(id);
  if (!existLaunch) {
    return res.status(404).json({
      error: 'Launch not found',
    });
  }
  const aborted = await abortLaunchById(id);

  if (!aborted) {
    return res.status(400).json({
      error: 'Launch not aborted',
    });
  }

  return res.status(200).json({
    message: 'Launch aborted',
    ok: true,
  });
}

module.exports = { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch };
