import express from "express";
import multer from "multer";
import { RegisterWorker } from "../controllers/worker.js";
// import { auth } from "../middleware/auth.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Worker registration route
router.post("/register", upload.array("documents"), RegisterWorker);

// Additional routes for workers can be added here, e.g., viewing service requests assigned to them

export default router;
