// src/routes/worker.js
import express from "express";
import { auth, workerAuth } from "../middleware/auth.js";
import { getJobs, acceptJob, completeJob } from "../controllers/worker.js";

const router = express.Router();

// Fetch available jobs (workers only)
router.get("/jobs", auth, workerAuth, getJobs);

// Worker accepts a job
router.put("/jobs/:id/accept", auth, workerAuth, acceptJob);

// Worker completes a job
router.put("/jobs/:id/complete", auth, workerAuth, completeJob);

export default router;
