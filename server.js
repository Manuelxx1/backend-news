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
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a Aiven
const db = mysql.createConnection({
  host: 'mysql-3fbee301-manuelbaidoxx6-40e1.l.aivencloud.com',
  user: 'avnadmin',
  password: 'AVNS_Um-I9imgU39tQcemNPa',
  database: 'defaultdb',
  port: 18175,
  ssl: { rejectUnauthorized: false }
});

// Endpoint para guardar preferencias
app.post('/guardar-preferencias', (req, res) => {
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

  db.query(query, [usuario_email, categoria_preferida, frecuencia_envio], (err) => {
    if (err) {
      console.error('Error al insertar en MySQL:', err);
      return res.status(500).json({ message: 'Error al guardar preferencias' });
    }

    res.status(200).json({ message: 'Preferencias guardadas correctamente' });
  });
});

// Endpoint para enviar boletines diarios
app.post('/enviar-boletines-diarios', async (req, res) => {
  const query = `
    SELECT usuario_email, categoria_preferida
    FROM preferencias
    WHERE frecuencia_envio = 'personalizado'
  `;

  db.query(query, async (err, results) => {
    if (err) return res.status(500).json({ message: 'Error al obtener usuarios' });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'noticiashoywebapp@gmail.com',
        pass: 'srcb ljhx mohb ntiv'
      }
    });

    for (const usuario of results) {
      const mailOptions = {
        from: 'noticiashoywebapp@gmail.com',
        to: usuario.usuario_email,
        subject: 'Boletín diario',
        text: `Tus intereses: ${usuario.categoria_preferida}`
      };

      try {
        await transporter.sendMail(mailOptions);
      } catch (error) {
        console.error(`Error al enviar a ${usuario.usuario_email}:`, error);
      }
    }

    res.json({ message: 'Boletines enviados' });
  });
});

// Escuchar en el puerto asignado por Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});












