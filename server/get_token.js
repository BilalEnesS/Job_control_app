const { google } = require('googleapis');
const readline = require('readline');
require('dotenv').config();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

const url = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
});

console.log('Authorize this app by visiting this url:', url);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
rl.question('Enter the code from that page here: ', async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  console.log('Your refresh token:', tokens.refresh_token);
  rl.close();
});