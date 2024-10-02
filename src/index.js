import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import serviceRoutes from "./routes/services.js";
import workerRoutes from "./routes/worker.js";
import adminRoutes from "./routes/admin.js";
import myRoutes from "./routes/myRoutes.js"
import logger from "./logger.js";
import { MONGO_URI, PORT } from "./global.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/me", myRoutes);

// Check if MONGO_URI is set in .env
if (!MONGO_URI) {
  logger.error('MongoDB URI is not set in the .env file');
  process.exit(1);
}

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => {
    logger.info(`✅ Connected to MongoDB database`);
    app.listen(PORT, () => logger.info(`⚡ Server running on port ${PORT} in ${process.env.NODE_ENV} mode ⚡`));
  })
  .catch((err) => {
    logger.error(`❌ Error connecting to MongoDB (${MONGO_URI}): ${err.message}`);
    logger.debug(`Full MongoDB connection error: ${err.stack}`);
    process.exit(1);
  });