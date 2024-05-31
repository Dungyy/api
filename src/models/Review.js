import { Schema, model } from 'mongoose';

const ReviewSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  service: {
    type: Schema.Types.ObjectId,
    ref: "ServiceRequest",
    required: true,
  },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
});

export default model("Review", ReviewSchema);
