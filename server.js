const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/send-news', async (req, res) => {
  const { email } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'tuemail@gmail.com',       // Reemplazá con tu email
      pass: 'tu_clave_app'             // Reemplazá con tu App Password de Gmail
    }
  });

  const mailOptions = {
    from: 'tuemail@gmail.com',
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

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
