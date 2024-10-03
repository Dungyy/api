import ServiceRequest from '../models/ServiceRequest.js';
import logger from '../logger.js'; // Make sure logger is imported

// export const getWorkerServiceRequests = async (req, res) => {
//   logger.debug(`Fetching service requests for worker ID: ${req.user.id}`);
//   try {
//     const serviceRequests = await ServiceRequest.find({ worker: req.user.id });
//     logger.info(`Fetched ${serviceRequests.length} service requests for worker ID: ${req.user.id}`);
//     res.status(200).json(serviceRequests);
//   } catch (err) {
//     logger.error(`Error fetching service requests: ${err.message}`);
//     res.status(500).json({ error: err.message });
//   }
// };

export const getJobs = async (req, res) => {
  logger.debug('Fetching available jobs');
  try {
    const jobs = await ServiceRequest.find({ status: "pending" });
    logger.info(`Fetched ${jobs.length} pending jobs`);
    res.json(jobs);
  } catch (err) {
    logger.error(`Error fetching jobs: ${err.message}`);
    res.status(500).json({ error: "Server error" });
  }
};

export const acceptJob = async (req, res) => {
  logger.debug(`Worker ID ${req.user.id} attempting to accept job ID: ${req.params.id}`);
  try {
    const job = await ServiceRequest.findById(req.params.id);
    if (!job) {
      logger.warn(`Job ID ${req.params.id} not found`);
      return res.status(404).json({ msg: "Job not found" });
    }
    if (job.status !== "pending") {
      logger.warn(`Job ID ${req.params.id} is no longer available`);
      return res.status(400).json({ msg: "Job is no longer available" });
    }
    job.worker = req.user.id;
    job.status = "in_progress";
    await job.save();
    logger.info(`Job ID ${req.params.id} accepted by worker ID ${req.user.id}`);
    res.json({ msg: "Job accepted", job });
  } catch (err) {
    logger.error(`Error accepting job: ${err.message}`);
    res.status(500).json({ error: "Server error" });
  }
}

export const completeJob = async (req, res) => {
  logger.debug(`Worker ID ${req.user.id} attempting to complete job ID: ${req.params.id}`);
  try {
    const job = await ServiceRequest.findById(req.params.id);
    if (!job) {
      logger.warn(`Job ID ${req.params.id} not found`);
      return res.status(404).json({ msg: "Job not found" });
    }

    // Ensure the job is in progress and belongs to the worker
    if (job.worker.toString() !== req.user.id) {
      logger.warn(`Unauthorized attempt by worker ID ${req.user.id} to complete job ID ${req.params.id}`);
      return res.status(401).json({ msg: "Unauthorized to complete this job" });
    }

    if (job.status !== "in_progress") {
      logger.warn(`Job ID ${req.params.id} is not in progress`);
      return res.status(400).json({ msg: "Job is not in progress" });
    }

    job.status = "completed";
    await job.save();
    logger.info(`Job ID ${req.params.id} completed by worker ID ${req.user.id}`);
    res.json({ msg: "Job completed", job });
  } catch (err) {
    logger.error(`Error completing job: ${err.message}`);
    res.status(500).json({ error: "Server error" });
  }
}
