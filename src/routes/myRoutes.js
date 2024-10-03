import express from "express";
import { auth } from "../middleware/auth.js";
import { getUserProfile, getUserRequests, deleteUserRequest, editUserRequest, cancelUserProfile } from "../controllers/myRoutes.js";

const router = express.Router();

// Get current user profile
router.get("/", auth, getUserProfile);

// Fetch service requests for the logged-in user
router.get("/requests", auth, getUserRequests);

// Delete a service request
router.delete("/requests/:id", auth, deleteUserRequest);

// Update (Edit) a service request
router.put("/requests/:id", auth, editUserRequest);

// Cancel a service request (soft delete or mark as canceled)
router.put("/requests/:id/cancel", auth, cancelUserProfile);

export default router;
