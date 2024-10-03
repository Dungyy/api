import User from '../models/User.js';
import logger from "../logger.js";
import { JWT_SECRET } from "../global.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, role });
        await user.save();
        res.status(201).json(user);
        logger.info(`New User registered with Name: ${user.name}, email: ${user.email}, Role: ${user.role}`);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
            expiresIn: "1h",
        });
        res.json({ token, user });
        logger.info(`User logged in email: ${user.email}`);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const registerWorker = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const documents = req.files.map((file) => file.buffer.toString("base64"));
        const user = new User({ name, email, password: hashedPassword, role: "worker", documents });
        await user.save();
        res.status(201).json(user);
        logger.info(`New worker registered with Name: ${user.name}, email: ${user.email}, Role: worker`);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};