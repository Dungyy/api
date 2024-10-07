import express from "express";
import { sendMessage, getMessages, deleteMessage, sendMsg, requestMsg } from "../controllers/messaging.js";
import { auth, adminAuth } from "../middleware/auth.js";

const router = express.Router();

// Send a message (POST /api/messages)
router.post("/", auth, sendMessage);

// Get all messages for the current user (GET /api/messages)
router.get("/", auth, getMessages);

// Delete a message (DELETE /api/messages/:messageId)
router.delete("/:messageId", auth, deleteMessage);

// POST /api/messages/:requestId - Send a new message
router.post('/:requestId', auth, sendMsg);

// GET /api/messages/:requestId - Get all messages for a service request
router.get('/:requestId', auth, adminAuth, requestMsg);


export default router;
