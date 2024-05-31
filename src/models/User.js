import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'worker'], default: 'customer' },
  isAdmin: { type: Boolean, default: false },
  documents: [{ type: String }],
});

export default model('User', UserSchema);
