import dotenv from 'dotenv';
dotenv.config();

const configs = {
  PORT: process.env.PORT,
  ENV: process.env.ENV,
  MONGODB_URI: process.env.MONGODB_URI,
  DB_URI: process.env.DB_URI,
  CLOUD_NAME: process.env.CLOUDINARY_NAME,
  CLOUD_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUD_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  HASH_SECRET: process.env.HASH_SECRET,
  SALT: process.env.HASH_SALT,
  JWT_SECRET: process.env.JWT_SECRET,
  PROD_URI: process.env.PROD_URI,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
  ARCJET_KEY: process.env.ARCJET_KEY,
  ARCJET_ENV: process.env.ARCJET_ENV
};

export default configs;