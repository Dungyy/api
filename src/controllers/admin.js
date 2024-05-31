import User from '../models/User.js';
import ServiceRequest from '../models/ServiceRequest.js';

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getServiceRequests = async (req, res) => {
  try {
    const serviceRequests = await ServiceRequest.find().populate('user');
    res.status(200).json(serviceRequests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
