const { google } = require('googleapis');
const express = require('express');

const app = express();
const port = 3001;

const oauth2Client = new google.auth.OAuth2(
  '781091117638-i3l123u2tre8un0q4dtvv0erqteckpi7.apps.googleusercontent.com',
  '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',
  'https://backend-news-api-gmail-oauth.onrender.com/oauth2callback'
);

const SCOPES = ['https://mail.google.com/'];

app.get('/', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  console.log('\n🔗 Copiá esta URL y pegala en tu navegador:\n');
  console.log(authUrl);
  res.send('Abrí la URL que aparece en la consola para autorizar.');
});

app.get('/oauth2callback', async (req, res) => {
  const code = req.query.code;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    console.log('\n✅ Tokens generados:\n');
    console.log(tokens);
    res.send('Autorización completada. Revisá la consola para ver los tokens.');
  } catch (error) {
    console.error('❌ Error al obtener los tokens:', error);
    res.send('Hubo un error al procesar el código de autorización.');
  }
});

app.listen(port, () => {
  console.log(`\n🚀 Servidor iniciado en http://localhost:${port}`);
  console.log('https://backend-news-api-gmail-oauth.onrender.com/ accede en tu navegador para comenzar.\n');
});
