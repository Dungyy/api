import mongoose from "mongoose";

const serviceRequestSchema = new mongoose.Schema({
  customerName: {
    type: String,  // Store customer name for easier access
    required: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",  // Reference to the User model for customers
    required: true,
  },
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",  // Reference to the User model for workers
    default: null,
  },
  serviceType: {
    type: String,
    enum: [
      // Summer Activities
      "mowing_lawn",
      "garden_maintenance",
      "weed_control",
      "landscape_design",
      "painting_staining",
      "window_cleaning",
      "gutter_cleaning",
      "roof_inspection",
      "pool_opening_closing",
      "pool_cleaning",
      "deck_cleaning",
      "bbq_cleaning",
      "pest_control",
      "hvac_maintenance",
      // Winter Activities
      "snow_removal",
      "furnace_inspection",
      "chimney_sweep",
      "winterizing_home",
      "holiday_setup",
      "gutter_cleaning_winter",
      "roof_check_ice_dams",
      "indoor_cleaning",
      "indoor_painting",
      "emergency_heating_fix",
      "emergency_plumbing",
    ],
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "in_progress", "completed", "canceled"],
    default: "pending",
  },
  address: {  
    type: String,
    required: true,
  },
  contactInfo: {
    type: String, // Additional contact info
  },
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ServiceRequest = mongoose.model("ServiceRequest", serviceRequestSchema);
export default ServiceRequest;
