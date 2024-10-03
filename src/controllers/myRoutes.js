import User from "../models/User.js";
import logger from "../logger.js";
import ServiceRequest from "../models/ServiceRequest.js";

export const getUserProfile = async (req, res) => {
    logger.debug(`Fetching profile for user ID: ${req.user.name}`);
    try {
        const user = await User.findById(req.user.id).select("-password");
        logger.info(`Fetched profile for user ID: ${req.user.name}`);
        res.json(user);
    } catch (err) {
        logger.error(`Error fetching profile for user ID ${req.user.name}: ${err.message}`);
        res.status(500).json({ error: "Server error" });
    }
};

export const getUserRequests = async (req, res) => {
    logger.debug(`Fetching service requests for user ID: ${req.user.id}`);
    try {
      const serviceRequests = await ServiceRequest.find({ customer: req.user.id });
      logger.info(`Fetched ${serviceRequests.length} service requests for user ID: ${req.user.id}`);
      res.json(serviceRequests);
    } catch (err) {
      logger.error(`Error fetching service requests for user ID ${req.user.id}: ${err.message}`);
      res.status(500).json({ error: "Server error" });
    }
  };   

export const deleteUserRequest = async (req, res) => {
    logger.debug(`User ID ${req.user.name} attempting to delete request ID: ${req.user.name}`);
    try {
        const request = await ServiceRequest.findById(req.params.id);
        if (!request) {
            logger.debug(`Request with ID ${req.user.name} not found`);
            return res.status(404).json({ msg: "Service request not found" });
        }

        // Ensure the request belongs to the logged-in user
        if (request.user.toString() !== req.user.id) {
            logger.debug(`User ID ${req.user.id} not authorized to delete request ID ${req.params.id}`);
            return res.status(401).json({ msg: "User not authorized" });
        }

        await request.deleteOne();
        logger.info(`Request ID ${req.params.id} deleted by user ID ${req.user.id}`);
        res.json({ msg: "Service request removed" });
    } catch (err) {
        logger.error(`Error deleting request ID ${req.params.id} for user ID ${req.user.id}: ${err.message}`);
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

export const editUserRequest = async (req, res) => {
    const { serviceType, date, time } = req.body;
    logger.debug(`User ID ${req.user.id} attempting to edit request ID: ${req.params.id}`);

    try {
        const request = await ServiceRequest.findById(req.params.id);
        if (!request) {
            logger.debug(`Request with ID ${req.params.id} not found`);
            return res.status(404).json({ msg: "Service request not found" });
        }

        // Ensure the request belongs to the logged-in user
        if (request.user.toString() !== req.user.id) {
            logger.debug(`User ID ${req.user.id} not authorized to edit request ID ${req.params.id}`);
            return res.status(401).json({ msg: "User not authorized" });
        }

        request.serviceType = serviceType || request.serviceType;
        request.date = date || request.date;
        request.time = time || request.time;

        await request.save();
        logger.info(`Request ID ${req.params.id} edited by user ID ${req.user.id}`);
        res.json(request);
    } catch (err) {
        logger.error(`Error editing request ID ${req.params.id} for user ID ${req.user.id}: ${err.message}`);
        res.status(500).json({ error: "Server error" });
    }
};

export const cancelUserProfile = async (req, res) => {
    logger.debug(`User ID ${req.user.id} attempting to cancel request ID: ${req.params.id}`);
    try {
        const request = await ServiceRequest.findById(req.params.id);
        if (!request) {
            logger.debug(`Request with ID ${req.params.id} not found`);
            return res.status(404).json({ msg: "Service request not found" });
        }

        // Ensure the request belongs to the logged-in user
        if (request.user.toString() !== req.user.id) {
            logger.debug(`User ID ${req.user.id} not authorized to cancel request ID ${req.params.id}`);
            return res.status(401).json({ msg: "User not authorized" });
        }

        request.status = "canceled"; // Add a canceled status
        await request.save();
        logger.info(`Request ID ${req.params.id} canceled by user ID ${req.user.id}`);
        res.json(request);
    } catch (err) {
        logger.error(`Error canceling request ID ${req.params.id} for user ID ${req.user.id}: ${err.message}`);
        res.status(500).json({ error: "Server error", details: err.message });
    }
};
