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
app.post('/enviar-correo', async (req, res) => {
  const { email, intereses } = req.body;

  if (!email || !Array.isArray(intereses) || intereses.length === 0) {
    return res.status(400).send({ message: 'Faltan datos o intereses vacíos' });
  }

  const contenido = intereses.map(i => `<li>${i}</li>`).join('');
  const html = `
    <h2>📰 Tus noticias seleccionadas</h2>
    <p>Recibiste este correo porque elegiste recibir noticias sobre:</p>
    <ul>${contenido}</ul>
    <p>Gracias por usar nuestro servicio, Manuel 😉</p>
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
    subject: 'Tus preferencias de noticias',
    html
  };

  try {
    await transporter.sendMail(mailOptions);
    res.send({ message: 'Correo enviado con tus preferencias' });
  } catch (error) {
    console.error('Error al enviar correo:', error);
    res.status(500).send({ message: 'Error al enviar correo' });
  }
});



app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});





