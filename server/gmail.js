const { google } = require('googleapis');
require('dotenv').config();

const auth = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);
auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
console.log('REFRESH TOKEN:', process.env.GOOGLE_REFRESH_TOKEN);
auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

const gmail = google.gmail({ version: 'v1', auth });

async function getRecentApplicationEmails() {
  const res = await gmail.users.messages.list({
    userId: 'me',
    maxResults: 30,
    q: 'subject:"Your application was sent to"',
  });

  const messages = res.data.messages || [];

  const results = [];

  for (let msg of messages) {
    const message = await gmail.users.messages.get({
      userId: 'me',
      id: msg.id,
    });

    let bodyData = message.data.snippet || '';
    // HTML body'yi bulmaya çalış
    const parts = message.data.payload.parts;
    if (parts) {
      const htmlPart = parts.find(p => p.mimeType === 'text/html');
      if (htmlPart && htmlPart.body && htmlPart.body.data) {
        // Gmail base64url encoding kullanır
        const buff = Buffer.from(htmlPart.body.data, 'base64');
        bodyData = buff.toString('utf-8');
      }
    }

    const headers = message.data.payload.headers;

    const subject = headers.find(h => h.name === 'Subject')?.value || '';
    const from = headers.find(h => h.name === 'From')?.value || '';
    const date = headers.find(h => h.name === 'Date')?.value || '';

    results.push({ subject, from, date, body: bodyData });
  }

  return results;
}


module.exports = { getRecentApplicationEmails };
