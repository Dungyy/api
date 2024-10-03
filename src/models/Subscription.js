// models/Subscription.js
import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
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
  frequency: {
    type: String,
    enum: ["weekly", "monthly", "seasonal"],
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive", "canceled"],
    default: "active",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;
