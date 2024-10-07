import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { JWT_SECRET } from "../global.js";

// Common auth middleware to check for a valid token
const auth = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  
  // Ensure the Authorization header is present and well-formed
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Authorization header missing or malformed." });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    // Verify the token and decode it
    const decoded = jwt.verify(token, JWT_SECRET);

    // Find the user associated with the token
    const user = await User.findById(decoded.id);
    
    // If user not found, reject access
    if (!user) {
      return res.status(401).json({ msg: "Invalid token. User not found." });
    }

    // Attach the user to the request for further access in other routes
    req.user = user;
    next();
  } catch (err) {
    // Handle specific token expiration case
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ msg: "Token has expired. Please log in again." });
    }

    // Handle generic invalid token case
    return res.status(401).json({ msg: "Token is invalid. Authorization denied." });
  }
};

// Middleware for admin authorization
const adminAuth = (req, res, next) => {
  // Ensure the user object is attached and the user has the admin role
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied. Admins only." });
  }
  next();
};

// Middleware for worker authorization
const workerAuth = (req, res, next) => {
  // Ensure the user object is attached and the user has the worker role
  if (!req.user || req.user.role !== "worker") {
    return res.status(403).json({ msg: "Access denied. Workers only." });
  }
  next();
};

// More flexible role-based middleware for future roles
// const roleAuth = (requiredRole) => (req, res, next) => {
//   if (!req.user || req.user.role !== requiredRole) {
//     return res.status(403).json({ msg: `Access denied. ${requiredRole} role required.` });
//   }
//   next();
// };

export { auth, adminAuth, workerAuth };
