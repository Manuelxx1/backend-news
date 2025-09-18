const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: '*'
}));

app.use(express.json());
/*
app.post('/send-news', async (req, res) => {
  const { email } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'manuelbaidoxx6@gmail.com',       // Reemplazá con tu email
      pass: 'gqekhmqueanhtrri'             // Reemplazá con tu App Password de Gmail
    }
  });

  const mailOptions = {
    from: 'manuelbaidoxx6@gmail.com',
    to: email,
    subject: 'Noticias Cripto del Día',
    html: `
      <h2>🚀 Actualización de precios</h2>
      <ul>
        <li>BTC subió 3.2%</li>
        <li>ETH bajó 1.1%</li>
        <li>DOGE se mantiene estable</li>
      </ul>
      <p>Gracias por seguirnos, Manuel 😉</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send({ message: 'Correo enviado con éxito' });
  } catch (error) {
    console.error('Error al enviar correo:', error);
    res.status(500).send({ message: 'Error al enviar correo' });
  }
});

*/

const enlacesPorSeccion = {
  cripto: 'https://4200-cs-a039ce25-3610-425a-9d0a-fbf343f80023.cs-us-east1-pkhd.cloudshell.dev/tecnologia',
  tecnologia: 'https://4200-cs-a039ce25-3610-425a-9d0a-fbf343f80023.cs-us-east1-pkhd.cloudshell.dev/tecnologia',
  politica: 'https://4200-cs-a039ce25-3610-425a-9d0a-fbf343f80023.cs-us-east1-pkhd.cloudshell.dev/politica',
  deportes: 'https://4200-cs-a039ce25-3610-425a-9d0a-fbf343f80023.cs-us-east1-pkhd.cloudshell.dev/deportes'
};

app.post('/enviar-correo', async (req, res) => {
  const { email, intereses } = req.body;

  if (!email || !Array.isArray(intereses) || intereses.length === 0) {
    return res.status(400).send({ message: 'Faltan datos o intereses vacíos' });
  }

  const enlacesHTML = intereses.map(i => {
    const url = enlacesPorSeccion[i];
    return url ? `<li><a href="${url}">${i}</a></li>` : '';
  }).join('');

  const html = `
    <h2>📰 Tus noticias seleccionadas</h2>
    <p>Elegiste recibir noticias sobre:</p>
    <ul>${enlacesHTML}</ul>
    <p>Podés hacer clic en cada enlace para ver la sección directamente en nuestro sitio.</p>
    <p>Gracias por elegir tu contenido, Manuel 😉</p>
  `;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'manuelbaidoxx6@gmail.com',
      pass: 'gqek hmqu eanh trri'
    }
  });

  const mailOptions = {
    from: 'manuelbaidoxx6@gmail.com',
    to: email,
    subject: 'Tus secciones de noticias personalizadas',
    html
  };

  try {
    await transporter.sendMail(mailOptions);
    res.send({ message: 'Correo enviado con enlaces personalizados' });
  } catch (error) {
    console.error('Error al enviar correo:', error);
    res.status(500).send({ message: 'Error al enviar correo' });
  }
});



app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});






