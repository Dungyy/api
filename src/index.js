import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import serviceRoutes from "./routes/services.js";
import workerRoutes from "./routes/worker.js";
import adminRoutes from "./routes/admin.js";
import logger from "./logger.js";
import { MONGO_URI } from "./global.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;

// Check if MONGO_URI is set in .env
if (!process.env.MONGO_URI) {
  logger.error('MongoDB URI is not set in the .env file');
  process.exit(1); // Exit the process with an error code
}

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() =>
    app.listen(process.env.PORT, () => logger.info(`⚡ Server running on port ${process.env.PORT} ⚡`))
  )
  .catch((err) => {
    logger.error(`Error connecting to MongoDB: ${err}`);
    process.exit(1); // Exit the process with an error code
  });