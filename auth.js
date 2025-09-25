const { google } = require('googleapis');
const express = require('express');

const app = express();
const port = 3000;

// Reemplazá estos valores con los tuyos
const oauth2Client = new google.auth.OAuth2(
  '781091117638-i3l123u2tre8un0q4dtvv0erqteckpi7.apps.googleusercontent.com',
  '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',
  'https://3000-cs-a039ce25-3610-425a-9d0a-fbf343f80023.cs-us-east1-pkhd.cloudshell.dev/oauth2callback'
);

const SCOPES = ['https://mail.google.com/'];

app.get('/', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  console.log('\n🔗 Copiá esta URL y pegala en tu navegador para autorizar:\n');
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
  console.log('Visitá https://3000-cs-a039ce25-3610-425a-9d0a-fbf343f80023.cs-us-east1-pkhd.cloudshell.dev/ en tu navegador para comenzar.\n');
});
