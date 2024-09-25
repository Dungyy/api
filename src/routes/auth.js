import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import User from "../models/User.js";
import { JWT_SECRET } from "../global.js";
import logger from "../logger.js";
import { auth } from "../middleware/auth.js";
import ServiceRequest from "../models/ServiceRequest.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Register route
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();
    res.status(201).json(user);
    logger.info(`New User registered with Name: ${user.name}, email: ${user.email}, Role: ${user.role}`);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token, user });
    logger.info(`User logged in email: ${user.email}`);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Register worker route
router.post("/register-worker", upload.array("documents"), async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const documents = req.files.map((file) => file.buffer.toString("base64"));
    const user = new User({ name, email, password: hashedPassword, role: "worker", documents });
    await user.save();
    res.status(201).json(user);
    logger.info(`New worker registered with Name: ${user.name}, email: ${user.email}, Role: worker`);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
