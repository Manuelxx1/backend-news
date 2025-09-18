const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: '*'
}));

app.use(express.json());

/*
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
*/

app.get('/enviar-boletin', async (req, res) => {
  const token = req.query.token;

  // 🔒 Validación de seguridad
  if (token !== 'secreto123') {
    return res.status(403).send({ message: 'Acceso no autorizado' });
  }

  // 🧠 Lista de usuarios e intereses (puede venir de una base de datos en el futuro)
  const usuarios = [
    { email: 'manuel@example.com', intereses: ['cripto', 'tecnologia'] },
    { email: 'sofia@example.com', intereses: ['politica'] }
  ];

  // 🔗 Enlaces por sección
  const enlacesPorSeccion = {
    cripto: 'https://4200-cs-a039ce25-3610-425a-9d0a-fbf343f80023.cs-us-east1-pkhd.cloudshell.dev/tecnologia',
  tecnologia: 'https://4200-cs-a039ce25-3610-425a-9d0a-fbf343f80023.cs-us-east1-pkhd.cloudshell.dev/tecnologia',
  politica: 'https://4200-cs-a039ce25-3610-425a-9d0a-fbf343f80023.cs-us-east1-pkhd.cloudshell.dev/politica',
  deportes: 'https://4200-cs-a039ce25-3610-425a-9d0a-fbf343f80023.cs-us-east1-pkhd.cloudshell.dev/deportes'
  };

  // ✉️ Configuración de Nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'manuelbaidoxx6@gmail.com',
      pass: 'gqek hmqu eanh trri'
    }
  });

  // 📤 Envío de correos personalizados
  for (const usuario of usuarios) {
    const enlacesHTML = usuario.intereses.map(i => {
      const url = enlacesPorSeccion[i];
      return url ? `<li><a href="${url}">${i}</a></li>` : '';
    }).join('');

    const html = `
      <h2>📰 Noticias seleccionadas</h2>
      <p>Hola ${usuario.email}, estas son tus secciones elegidas:</p>
      <ul>${enlacesHTML}</ul>
      <p>Gracias por seguirnos, ¡nos vemos mañana!</p>
    `;

    await transporter.sendMail({
      from: 'manuelbaidoxx6@gmail.com',
      to: usuario.email,
      subject: 'Tu boletín personalizado',
      html
    });
  }

  res.send({ message: 'Boletines enviados correctamente' });
});



app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});








