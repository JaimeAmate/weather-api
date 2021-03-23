import dotenv  from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;
const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GEOCODE_API_KEY = process.env.GOOGLE_CLOUD_API_KEY;

const MAIL_OAUTH_CLIENT_ID = process.env.OAUTH_CLIENT_ID;
const MAIL_OAUTH_CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;
const MAIL_REFRESH_TOKEN = process.env.OAUTH_REFRESH_TOKEN;
const MAIL_USERNAME = process.env.MAIL_USERNAME;

export {
  PORT,
  CLIENT_ID,
  CLIENT_SECRET,
  GEOCODE_API_KEY,
  MAIL_OAUTH_CLIENT_ID,
  MAIL_OAUTH_CLIENT_SECRET,
  MAIL_REFRESH_TOKEN,
  MAIL_USERNAME,
};
