import dotenv from 'dotenv';

dotenv.config();

export const MONGO_URI = process.env.MONGO_URI;
export const JWT_SECRET = process.env.JWT_SECRET;

export const IS_PROD = !(
  process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'development'
);

export const PORT = !IS_PROD ? 8000 : process.env.PORT;

// Basic AI responses for now
export const aiResponses = {
  "hello": "Hello! How can I help you today?",
  "hi": "Hi there! What can I assist you with?",
  "good morning": "Good morning! How can I make your day better?",
  "good afternoon": "Good afternoon! What assistance can I provide today?",
  "good evening": "Good evening! What can I do for you tonight?",
  
  "help": "Sure, I can assist you. What do you need help with?",
  "support": "I'm here to help! Please tell me more about your issue.",
  "assistance": "How may I assist you today?",
  "service help": "Looking for help with a service? I'm here for you.",
  "info help": "Need information? Ask away, and I'll do my best to assist!",

  "pricing": "Our services start at $10. For more details, visit our pricing page.",
  "cost": "Curious about costs? Our services begin at $10, but I can give more specific details if you like.",
  "fees": "Want to know about fees? They start at $10, and you can learn more on our pricing page.",
  "price details": "Need more detailed pricing? I can provide that. Which service are you interested in?",
  "how much": "Wondering how much it costs? Prices start at $10, but I can offer more details.",

  "bye": "Goodbye! Have a great day!",
  "farewell": "Farewell! If you need more help, just come back!",
  "goodbye": "Goodbye! It was nice assisting you today.",
  "see you": "See you! Don't hesitate to return if you need more help.",
  "later": "Catch you later! Let me know if there's more I can do for you.",

  "thank you": "You're welcome! Happy to help. Anything else you need?",
  "thanks": "No problem at all! If there's anything more I can do, just say the word.",
  "appreciate it": "I appreciate your kind words! Feel free to ask if you need more help.",
  "cheers": "Cheers! If you have more questions, I'm here to answer.",
  "thankful": "It's my pleasure to assist! Let me know if there's anything else.",

  "error": "Oops, something went wrong. Let me try to fix that for you.",
  "problem": "I see there’s a problem. Could you describe what happened?",
  "issue": "There seems to be an issue. Please provide more details so I can assist better.",
  "bug": "A bug, huh? Let me take a look and see how we can sort that out.",
  "glitch": "Glitches can be annoying. Tell me what's happening, and I'll help resolve it.",

  "account info": "I can help with that. What specific account details do you need?",
  "account update": "Need to update your account? I can guide you through that process.",
  "password reset": "To reset your password, follow the link I'm sending now.",
  "account assistance": "How can I assist with your account today?",
  "member info": "Need information about your membership? I'm here to help.",
};