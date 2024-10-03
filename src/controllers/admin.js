import User from '../models/User.js';
import ServiceRequest from '../models/ServiceRequest.js';
import logger from '../logger.js'; 

export const getUsers = async (req, res) => {
  logger.debug('Fetching all users');
  try {
    const users = await User.find();
    logger.info(`Fetched ${users.length} users`);
    res.status(200).json(users);
  } catch (err) {
    logger.error(`Error fetching users: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};

export const getServiceRequests = async (req, res) => {
  logger.debug('Fetching all service requests');
  try {
    const serviceRequests = await ServiceRequest.find()
      .populate('customer', 'name email')  // Populate the 'customer' field (or 'user' if that is the correct field)
      .populate('worker', 'name email');   // Populate 'worker' field if necessary
    logger.info(`Fetched ${serviceRequests.length} service requests`);
    res.status(200).json(serviceRequests);
  } catch (err) {
    logger.error(`Error fetching service requests: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};



export const getServices = async (req, res) => {
  logger.debug('Fetching services');
  try {
    const services = await ServiceRequest.find();
    logger.info(`Fetched ${services.length} services`);
    res.json(services);
  } catch (err) {
    logger.error(`Error fetching services: ${err.message}`);
    res.status(500).json({ error: "Server error" });
  }
};

export const promoteUser = async (req, res) => {
  logger.debug(`Attempting to promote user ${req.params.id}`);
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      logger.warn(`User with ID ${req.params.id} not found`);
      return res.status(404).json({ msg: 'User not found' });
    }
    user.isAdmin = true;
    await user.save();
    logger.info(`User ${user.email} promoted to admin by ${req.user.email}`);
    res.status(200).json({ msg: 'User promoted to admin', user });
  } catch (err) {
    logger.error(`Error promoting user: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};

export const getMyAccount = async (req, res) => {
  logger.debug(`Fetching account details for user ${req.user.id}`);
  try {
    const user = await User.findById(req.user.id).select('-password');
    logger.info(`Account details fetched for user ${req.user.email}`);
    res.json(user);
  } catch (err) {
    logger.error(`Error fetching account details: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};

export const getCurrentUser = async (req, res) => {
  logger.debug(`Fetching profile for user ID: ${req.user.id}`);
  try {
      const user = await User.findById(req.user.id).select("-password");
      logger.info(`Fetched profile for user ID: ${req.user.id}`);
      res.json(user);
  } catch (err) {
      logger.error(`Error fetching profile for user ID ${req.user.id}: ${err.message}`);
      res.status(500).json({ error: "Server error" });
  }
};