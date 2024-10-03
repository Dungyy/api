import ServiceRequest from "../models/ServiceRequest.js";
import logger from "../logger.js";

// Restrict service creation to non-workers
export const createServiceRequest = async (req, res) => {
  if (req.user.role === "worker") {
    return res.status(403).json({ msg: "Workers cannot create service requests." });
  }

  const { serviceType, description, date, time, address, contactInfo } = req.body;
  logger.debug(`User ID ${req.user.id} attempting to create a new service request`);

  try {
    const newServiceRequest = new ServiceRequest({
      customer: req.user.id,  // Customer making the request
      customerName: req.user.name,  // Get the user's name from req.user
      serviceType,
      description,
      date,
      time,
      address,
      contactInfo,
    });

    const savedRequest = await newServiceRequest.save();
    logger.info(`Service request created successfully by customer ID ${req.user.id}`);
    res.status(201).json(savedRequest);
  } catch (error) {
    logger.error(`Error creating service request by customer ID ${req.user.id}: ${error.message}`);
    res.status(500).json({ msg: "Failed to create service request", error: error.message });
  }
};

// Fetch available jobs for workers (jobs that are not yet accepted)
export const getAvailableJobs = async (req, res) => {
  if (req.user.role !== "worker") {
    return res.status(403).json({ msg: "Only workers can view available jobs." });
  }

  try {
    const jobs = await ServiceRequest.find({ worker: null });
    logger.info(`Fetched ${jobs.length} available jobs`);
    res.status(200).json(jobs);
  } catch (error) {
    logger.error(`Error fetching available jobs: ${error.message}`);
    res.status(500).json({ msg: "Failed to fetch available jobs", error: error.message });
  }
};

// Accept a job (worker accepts the job)
export const acceptJob = async (req, res) => {
  if (req.user.role !== "worker") {
    return res.status(403).json({ msg: "Only workers can accept jobs." });
  }

  try {
    const job = await ServiceRequest.findById(req.params.id);
    if (!job || job.worker) {
      return res.status(404).json({ msg: "Job not available or already accepted" });
    }

    job.worker = req.user.id;
    job.status = "in_progress";
    await job.save();
    logger.info(`Worker ID ${req.user.id} accepted job ID ${req.params.id}`);
    res.status(200).json({ msg: "Job accepted", job });
  } catch (error) {
    logger.error(`Error accepting job ID ${req.params.id}: ${error.message}`);
    res.status(500).json({ msg: "Failed to accept job", error: error.message });
  }
};

// Fetch worker's accepted jobs (jobs in progress)
export const getAcceptedJobs = async (req, res) => {
  if (req.user.role !== "worker") {
    return res.status(403).json({ msg: "Only workers can view their accepted jobs." });
  }

  try {
    const jobs = await ServiceRequest.find({ worker: req.user.id, status: "in_progress" });
    logger.info(`Fetched ${jobs.length} accepted jobs for worker ID ${req.user.id}`);
    res.status(200).json(jobs);
  } catch (error) {
    logger.error(`Error fetching accepted jobs for worker ID ${req.user.id}: ${error.message}`);
    res.status(500).json({ msg: "Failed to fetch accepted jobs", error: error.message });
  }
};

// Complete a job (and remove it from the worker's profile)
export const completeJob = async (req, res) => {
  if (req.user.role !== "worker") {
    return res.status(403).json({ msg: "Only workers can complete jobs." });
  }

  try {
    const job = await ServiceRequest.findById(req.params.id);
    if (!job || job.worker.toString() !== req.user.id || job.status !== "in_progress") {
      return res.status(404).json({ msg: "Job not found or you cannot complete this job" });
    }

    // Mark job as completed
    job.status = "completed";
    await job.save();

    // Remove job from worker's profile
    await job.deleteOne();

    logger.info(`Worker ID ${req.user.id} completed and deleted job ID ${req.params.id}`);
    res.status(200).json({ msg: "Job completed and removed from profile" });
  } catch (error) {
    logger.error(`Error completing job ID ${req.params.id} by worker ID ${req.user.id}: ${error.message}`);
    res.status(500).json({ msg: "Failed to complete job", error: error.message });
  }
};
