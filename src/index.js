import express from "express";
import mongoose from "mongoose";
import { createServer } from 'http'; // Correct import
import { Server } from 'socket.io';
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import serviceRoutes from "./routes/services.js";
import workerRoutes from "./routes/worker.js";
import adminRoutes from "./routes/admin.js";
import myRoutes from "./routes/myRoutes.js";
import messagingRoutes from "./routes/messaging.js";
import logger from "./logger.js";
import { MONGO_URI, PORT, aiResponses } from "./global.js";

dotenv.config();
const app = express();
const httpServer = createServer(app); // Use HTTP server for Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/me", myRoutes);
app.use("/api/messages", messagingRoutes);


// Function to get AI response
function getAIResponse(message) {
  const messageLower = message;
  for (const key in aiResponses) {
    if (messageLower.includes(key)) {
      return aiResponses[key];
    }
  }
  return "I'm not sure how to help with that. Can you try asking something else?";
}

io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);

  socket.on('sendMessage', (data) => {
    console.log('Message received:', data);
    socket.broadcast.emit('receiveMessage', { text: data, sender: 'User' });

    // Get AI response
    const response = getAIResponse(data);
    // Emit AI response back to the sender after a slight delay to simulate typing
    setTimeout(() => {
      socket.emit('receiveMessage', { text: response, sender: 'AI' });
    }, 1000); // Delay of 1 second
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Check if MONGO_URI is set
if (!MONGO_URI) {
  logger.error('MongoDB URI is not set in the .env file');
  process.exit(1);
}

// Use httpServer to listen instead of the Express app directly
const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    logger.info(`✅ Connected to MongoDB database ✅`);

    httpServer.listen(PORT, () => {
      logger.info(`⚡ Server running on port ${PORT} in ${process.env.NODE_ENV} mode ⚡`);
    });
  } catch (err) {
    logger.error(`❌ Error connecting to MongoDB (${MONGO_URI}): ${err.message}`);
    logger.debug(`Full MongoDB connection error: ${err.stack}`);
    process.exit(1);
  }
};

startServer();
