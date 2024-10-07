import Message from "../models/Messaging.js";
import User from "../models/User.js";
import ServiceRequest from "../models/ServiceRequest.js";

// Controller to handle sending a message
export const sendMessage = async (req, res) => {
  const { recipientId, message } = req.body;
  const senderId = req.user.id;

  try {
    // Ensure recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ msg: "Recipient not found" });
    }

    // Create a new message
    const newMessage = new Message({
      sender: senderId,
      recipient: recipientId,
      message,
    });

    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: "Server error while sending message." });
  }
};

// Controller to get messages for the current user (received and sent)
export const getMessages = async (req, res) => {
  const userId = req.user.id;

  try {
    // Retrieve messages where the user is either the sender or recipient
    const messages = await Message.find({
      $or: [{ sender: userId }, { recipient: userId }],
    })
      .populate("sender", "name email")
      .populate("recipient", "name email")
      .sort({ sentAt: -1 });

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: "Server error while fetching messages." });
  }
};

// Controller to delete a message
export const deleteMessage = async (req, res) => {
  const { messageId } = req.params;
  const userId = req.user.id;

  try {
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ msg: "Message not found" });
    }

    // Only allow deletion if the user is the sender or recipient of the message
    if (message.sender.toString() !== userId && message.recipient.toString() !== userId) {
      return res.status(403).json({ msg: "You are not authorized to delete this message." });
    }

    await message.remove();
    res.status(200).json({ msg: "Message deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error while deleting message." });
  }
};

// Controller to requestMsg a message - Get all messages for a service request
export const requestMsg = async (req, res) => {
    try {
      const messages = await Message.find({ serviceRequest: req.params.requestId })
        .populate('sender', 'name');
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

//   requestId - Send a new message
export const sendMsg = async (req, res) => {
    try {
      const { content } = req.body;
      const serviceRequest = await ServiceRequest.findById(req.params.requestId);
      if (!serviceRequest) return res.status(404).send('Service request not found');
  
      const newMessage = new Message({
        serviceRequest: req.params.requestId,
        sender: req.user._id,
        content
      });
      await newMessage.save();
  
      serviceRequest.messages.push(newMessage);
      await serviceRequest.save();
  
      res.status(201).json(newMessage);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }