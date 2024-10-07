import express from "express";
import multer from "multer";
import { register, login, registerWorker } from "../controllers/auth.js";
import rateLimit from "express-rate-limit";
const router = express.Router();

// Setup Multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // Limit to 10MB files

// Setup rate limiting for login
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes window
    max: 5, // Block after 5 requests
    message: "Too many login attempts, please try again later.",
})

// Register route 
router.post("/register", register);

// Login route with rate limiting 
router.post("/login", loginLimiter, login);

// Worker registration route with file uploads
router.post("/register-worker", upload.array("documents"), registerWorker);

export default router;
