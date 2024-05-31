import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { JWT_SECRET } from "../global.js";


const auth = async (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ msg: "Token is not valid" });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

// // Middleware to check if the user is an admin
// const isAdmin = (req, res, next) => {
//   if (!req.user.isAdmin) {
//     return res.status(403).json({ msg: "Admin access required" });
//   }
//   next();
// };

export { auth };
