require("dotenv").config();

const config = {
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_TOKEN_EXP: process.env.JWT_TOKEN_EXP,
  MONGO_DB_URL: process.env.MONGO_DB_URL,
  BUCKETEER_AWS_ACCESS_KEY_ID: process.env.BUCKETEER_AWS_ACCESS_KEY_ID,
  BUCKETEER_AWS_REGION: process.env.BUCKETEER_AWS_REGION,
  BUCKETEER_AWS_SECRET_ACCESS_KEY: process.env.BUCKETEER_AWS_SECRET_ACCESS_KEY,
  BUCKETEER_BUCKET_NAME: process.env.BUCKETEER_BUCKET_NAME,
};

const checkKeys = () => {
  const keys = Object.keys(config);
  keys.forEach((key) => {
    if (!config[key]) {
      throw new Error(`Key ${key} is missing`);
    }
  });
};
checkKeys();
module.exports = config;
