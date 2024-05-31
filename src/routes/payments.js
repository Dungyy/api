import express from "express";
import stripePackage from "stripe";
import auth from "../middleware/auth.js";

const router = express.Router();
const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);

router.post("/create-payment-intent", auth, async (req, res) => {
  const { amount, serviceFee } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount + serviceFee,
      currency: "usd",
      payment_method_types: ["card"],
    });
    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).send({
      error: error.message,
    });
  }
});

export default router;
