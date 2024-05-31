import { Schema, model } from 'mongoose';

const ServiceRequestSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  serviceType: { type: String, required: true },
});

export default model("ServiceRequest", ServiceRequestSchema);

