import express from "express";
import { auth } from "../middleware/auth.js";
import {
  createServiceRequest,
  getAvailableJobs,
  acceptJob,
  getAcceptedJobs,
  completeJob,
} from "../controllers/services.js";

const router = express.Router();

// Only customers can create service requests
router.post("/", auth, createServiceRequest);

// Workers can view available jobs
router.get("/jobs", auth, getAvailableJobs);

// Workers can accept jobs
router.put("/jobs/:id/accept", auth, acceptJob);

// Workers can view accepted jobs in their profile
router.get("/profile/jobs", auth, getAcceptedJobs);

// Workers can complete jobs (and the job gets removed after completion)
router.put("/jobs/:id/complete", auth, completeJob);

export default router;
