const { google } = require('googleapis');
const express = require('express');
const open = require('open');

const app = express();
const port = 3000;

const oauth2Client = new google.auth.OAuth2(
  '781091117638-i3l123u2tre8un0q4dtvv0erqteckpi7.apps.googleusercontent.com',
  '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',
  'http://localhost:3000/oauth2callback'
);

const SCOPES = ['https://mail.google.com/'];

app.get('/', async (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  await open(authUrl);
  res.send('Redirigiendo a Google para autorización...');
});

app.get('/oauth2callback', async (req, res) => {
  const code = req.query.code;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  console.log('✅ Tokens generados:');
  console.log(tokens);
  res.send('Autorización completada. Revisá la consola para ver los tokens.');
});

app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});
