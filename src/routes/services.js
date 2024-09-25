import express from "express";
import { check, validationResult } from "express-validator";
import { auth } from "../middleware/auth.js";
import ServiceRequest from "../models/ServiceRequest.js";

const router = express.Router();

router.post(
  "/",
  [
    auth,
    [
      check("date", "Date is required").not().isEmpty(),
      check("time", "Time is required").not().isEmpty(),
      check("serviceType", "Service type is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { date, time, serviceType } = req.body;
    try {
      const serviceRequest = new ServiceRequest({
        user: req.user.id,
        date,
        time,
        serviceType,
      });
      await serviceRequest.save();
      res.status(201).json(serviceRequest);
    } catch (err) {
      console.error('Error:', err.message); // Log error messages

      res.status(500).json({ error: err.message });
    }
  }
);

export default router;
