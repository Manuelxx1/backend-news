  const { google } = require('googleapis');
const express = require('express');
const app = express();

const oauth2Client = new google.auth.OAuth2(
  '781091117638-g9ltick8t9csfmumaqtl66g9n2is2v5a.apps.googleusercontent.com',
  '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',
  'https://backend-news-api-gmail-oauth.onrender.com/oauth2callback'
);

const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];

app.get('/', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  res.send(`Autorizá la app: <a href="${authUrl}">Click aquí</a>`);
});

app.get('/oauth2callback', async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  console.log('Tokens:', tokens);
  res.send('Autorización completada. Revisá los logs para ver los tokens.');
});

app.listen(3001, () => {
  console.log('Servidor OAuth corriendo en puerto 3001');
});
