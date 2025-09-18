const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: '*'
}));

app.use(express.json());

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

app.post('/intereses', (req, res) => {
  const { email, intereses } = req.body;

  if (!email || !intereses || !Array.isArray(intereses)) {
    return res.status(400).send({ message: 'Datos inválidos' });
  }

  console.log(`Usuario ${email} eligió: ${intereses.join(', ')}`);
  res.send({ message: 'Preferencias guardadas' });
});


app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});




