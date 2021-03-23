import nodemailer from 'nodemailer';
import { MAIL_OAUTH_CLIENT_ID, MAIL_OAUTH_CLIENT_SECRET, MAIL_REFRESH_TOKEN, MAIL_USERNAME } from '../config/environmentVariables';

const mailer = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    type: 'OAuth2',
    user: MAIL_USERNAME,
    clientId: MAIL_OAUTH_CLIENT_ID,
    clientSecret: MAIL_OAUTH_CLIENT_SECRET,
    refreshToken: MAIL_REFRESH_TOKEN,
  },
});

export default mailer;
