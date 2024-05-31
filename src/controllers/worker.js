import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import ServiceRequest from '../models/ServiceRequest.js';

export const RegisterWorker = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const documents = req.files.map(file => file.buffer.toString('base64'));
    const user = new User({ name, email, password: hashedPassword, role: 'worker', documents });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getWorkerServiceRequests = async (req, res) => {
  try {
    const serviceRequests = await ServiceRequest.find({ worker: req.user.id });
    res.status(200).json(serviceRequests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
