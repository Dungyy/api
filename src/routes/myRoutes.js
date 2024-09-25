import express from "express";
import User from "../models/User.js";
import logger from "../logger.js";
import { auth } from "../middleware/auth.js";
import ServiceRequest from "../models/ServiceRequest.js";

const router = express.Router();

// Get current user profile
router.get("/", auth, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password");
      res.json(user); 
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  });
  
  
  // Fetch service requests for the logged-in user
  router.get("/requests", auth, async (req, res) => {
    try {
      const serviceRequests = await ServiceRequest.find({ user: req.user.id });
      res.json(serviceRequests);
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  });
  
  // Delete a service request
  router.delete("/requests/:id", auth, async (req, res) => {
    try {
      const request = await ServiceRequest.findById(req.params.id);
      if (!request) return res.status(404).json({ msg: "Service request not found" });
  
      // Ensure the request belongs to the logged-in user
      if (request.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: "User not authorized" });
      }
  
      await request.deleteOne();
      res.json({ msg: "Service request removed" });
    } catch (err) {
      logger.error(err);
      res.status(500).json({ error: "Server error", details: err.message });
    }
  });
  
  // Update (Edit) a service request
  router.put("/requests/:id", auth, async (req, res) => {
    const { serviceType, date, time } = req.body;
  
    try {
      const request = await ServiceRequest.findById(req.params.id);
      if (!request) return res.status(404).json({ msg: "Service request not found" });
  
      // Ensure the request belongs to the logged-in user
      if (request.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: "User not authorized" });
      }
  
      request.serviceType = serviceType || request.serviceType;
      request.date = date || request.date;
      request.time = time || request.time;
  
      await request.save();
      res.json(request);
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  });
  
  // Cancel a service request (soft delete or mark as canceled)
  router.put("/requests/:id/cancel", auth, async (req, res) => {
    try {
      const request = await ServiceRequest.findById(req.params.id);
      if (!request) return res.status(404).json({ msg: "Service request not found" });
  
      // Ensure the request belongs to the logged-in user
      if (request.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: "User not authorized" });
      }
  
      request.status = "canceled"; // Add a canceled status
      await request.save();
      res.json(request);
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  });
  
  export default router;