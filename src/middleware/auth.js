import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { JWT_SECRET } from "../global.js";

// Common auth middleware to check for a valid token
const auth = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ msg: "Token is not valid" });

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

// Middleware for admin authorization
const adminAuth = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ msg: "Access denied. Admin only." });
  }
  next();
};

// Middleware for worker authorization
const workerAuth = (req, res, next) => {
  if (req.user?.role !== "worker") {
    return res.status(403).json({ msg: "Access denied. Worker only." });
  }
  next();
};

export { auth, adminAuth, workerAuth };
