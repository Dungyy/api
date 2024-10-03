import express from "express";
import multer from "multer";
import { register, login, registerWorker } from "../controllers/auth.js";
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// Register route
router.post("/register", register);

// Login route
router.post("/login", login);

// Worker registration route
router.post("/register-worker", upload.array("documents"), registerWorker);

export default router;
