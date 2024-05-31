import dotenv from 'dotenv';

dotenv.config();

export const MONGO_URI = process.env.MONGO_URI;
export const JWT_SECRET = process.env.JWT_SECRET;

export const IS_PROD = !(
  process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
);

export const IS_DEV = process.env.NODE_ENV === 'development';

export const PORT = IS_DEV ? 5000 : process.env.PORT;
