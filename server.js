/* para json
const express = require('express');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// 🌐 Enlaces por sección
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
    pass: 'gqek hmqu eanh trri' // contraseña de aplicación
  }
});

// 📥 Guardar datos del formulario
app.post('/enviar-correo', (req, res) => {
  const { email, intereses } = req.body;

  if (!email || !Array.isArray(intereses)) {
    return res.status(400).send({ message: 'Datos inválidos' });
  }

  const filePath = path.join(__dirname, 'usuarios.json');
  let usuarios = [];

  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf8');
    usuarios = JSON.parse(data);
  }

  const index = usuarios.findIndex(u => u.email === email);
  if (index !== -1) {
    usuarios[index].intereses = intereses;
  } else {
    usuarios.push({ email, intereses });
  }

  fs.writeFileSync(filePath, JSON.stringify(usuarios, null, 2));
  res.send({ message: 'Usuario guardado en archivo JSON' });
});

// 👀 Ver usuarios registrados
app.get('/usuarios', (req, res) => {
  const filePath = path.join(__dirname, 'usuarios.json');

  if (!fs.existsSync(filePath)) {
    return res.status(404).send({ message: 'Archivo no encontrado' });
  }

  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const usuarios = JSON.parse(data);
    res.send(usuarios);
  } catch (error) {
    console.error('❌ Error al leer usuarios.json:', error);
    res.status(500).send({ message: 'Error al procesar el archivo' });
  }
});

// 🚀 Enviar boletines (usado por workflow)
app.get('/enviar-boletin', async (req, res) => {
  try {
    if (req.query.token !== 'secreto123') {
      return res.status(403).send({ message: 'Acceso no autorizado' });
    }

    const filePath = path.join(__dirname, 'usuarios.json');
    if (!fs.existsSync(filePath)) {
      return res.status(404).send({ message: 'No hay usuarios registrados' });
    }

    const data = fs.readFileSync(filePath, 'utf8');
    const usuarios = JSON.parse(data);

    if (!Array.isArray(usuarios) || usuarios.length === 0) {
      return res.status(200).send({ message: 'No hay usuarios para enviar boletines' });
    }

    for (const usuario of usuarios) {
      const enlacesHTML = usuario.intereses.map(i => {
        const url = enlacesPorSeccion[i];
        return url ? `<li><a href="${url}">${i}</a></li>` : `<li>${i} (sin enlace)</li>`;
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

    res.send({ message: 'Boletines enviados desde archivo JSON' });
  } catch (error) {
    console.error('❌ Error en /enviar-boletin:', error);
    res.status(500).send({ message: 'Error interno del servidor' });
  }
});

// 🟢 Iniciar servidor
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
*/

const express = require('express');
const mysql = require('mysql2');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());


// Conexión a Aiven
const db = mysql.createConnection({
  host: 'mysql-3fbee301-manuelbaidoxx6-40e1.l.aivencloud.com',
  user: 'avnadmin',
  password: 'AVNS_Um-I9imgU39tQcemNPa',
  database: 'defaultdb',
  port: 18175,
  ssl: { rejectUnauthorized: false }

});

// Ruta para recibir preferencias
app.post('/guardar-preferencias', async (req, res) => {
  const { email, intereses } = req.body;

  if (!email || !Array.isArray(intereses)) {
    return res.status(400).json({ message: 'Datos inválidos' });
  }

  const usuario_email = email;
  const categoria_preferida = intereses.join(', ');
  const frecuencia_envio = 'personalizado';

  const query = `
    INSERT INTO preferencias (usuario_email, categoria_preferida, frecuencia_envio)
    VALUES (?, ?, ?)
  `;

  db.query(query, [usuario_email, categoria_preferida, frecuencia_envio], (err, result) => {
    if (err) {
      console.error('Error al insertar en MySQL:', err);
      return res.status(500).json({ message: 'Error al guardar preferencias' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'manuelbaidoxx6@gmail.com',
        pass: 'gqek hmqu eanh trri'
      }
    });

    const mailOptions = {
      from: 'manuelbaidoxx6@gmail.com',
      to: usuario_email,
      subject: 'Preferencias guardadas',
      text: `Hola! Tus preferencias han sido guardadas: categoría ${categoria_preferida}, frecuencia ${frecuencia_envio}.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error al enviar email:', error);
        return res.status(500).json({ message: 'Preferencias guardadas, pero falló el email' });
      }

      console.log('Email enviado:', info.response);
      res.status(200).json({ message: 'Preferencias guardadas y email enviado' });
    });
  });
});


// Iniciar servidor
app.listen(3000, () => {
  console.log('Servidor corriendo en puerto 3000');
});







