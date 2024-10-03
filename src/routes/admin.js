// src/routes/admin.js
import express from "express";
import { auth, adminAuth } from "../middleware/auth.js";
import { getUsers, getServiceRequests, promoteUser, getCurrentUser } from "../controllers/admin.js";

const router = express.Router();

// Get all users (admin only)
router.get("/users", auth, adminAuth, getUsers);

// Get all service requests (admin only)
router.get("/service-requests", auth, adminAuth, getServiceRequests);

// Promote a user to admin (admin only)
router.put("/promote/:id", auth, adminAuth, promoteUser);

// Get current user profile
router.get("/me", auth, getCurrentUser);

export default router;
