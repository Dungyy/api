import express from "express";
import { check, validationResult } from "express-validator";
import auth from "../middleware/auth.js";
import Review from "../models/Review.js";

const router = express.Router();

router.post(
  "/",
  [
    auth,
    [
      check("rating", "Rating is required").isInt({ min: 1, max: 10 }),
      check("comment", "Comment is required").not().isEmpty(),
      check("serviceId", "Service ID is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { rating, comment, serviceId } = req.body;
    try {
      const review = new Review({
        user: req.user.id,
        service: serviceId,
        rating,
        comment,
      });
      await review.save();
      res.status(201).json(review);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

export default router;
