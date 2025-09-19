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

//datos de usuario del form para nodemailer
//y luego ser usado por enviar-boletin para,workflow

const fs = require('fs');
const path = require('path');

const enlacesPorSeccion = {
  cripto: 'https://4200-cs-a039ce25-3610-425a-9d0a-fbf343f80023.cs-us-east1-pkhd.cloudshell.dev/tecnologia',
  tecnologia: 'https://4200-cs-a039ce25-3610-425a-9d0a-fbf343f80023.cs-us-east1-pkhd.cloudshell.dev/tecnologia',
  politica: 'https://4200-cs-a039ce25-3610-425a-9d0a-fbf343f80023.cs-us-east1-pkhd.cloudshell.dev/politica',
  deportes: 'https://4200-cs-a039ce25-3610-425a-9d0a-fbf343f80023.cs-us-east1-pkhd.cloudshell.dev/deportes'
};

app.post('/enviar-correo', (req, res) => {
  const { email, intereses } = req.body;

  if (!email || !Array.isArray(intereses)) {
    return res.status(400).send({ message: 'Datos inválidos' });
  }

  const filePath = path.join(__dirname, 'usuarios.json');
  let usuarios = [];

  // Leer archivo existente
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf8');
    usuarios = JSON.parse(data);
  }

  // Reemplazar si el email ya existe
  const index = usuarios.findIndex(u => u.email === email);
  if (index !== -1) {
    usuarios[index].intereses = intereses;
  } else {
    usuarios.push({ email, intereses });
  }

  // Guardar en archivo
  fs.writeFileSync(filePath, JSON.stringify(usuarios, null, 2));

  res.send({ message: 'Usuario guardado en archivo JSON' });
});

//ver json en navegador


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



//usado por workflow
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
        return url ? `<li><a href="${url}">${i}</a></li>` : '';
      }).join('');

      const html = `
        <h2>📰 Noticias seleccionadas</h2>
        <p>Hola ${usuario.email}, estas son tus secciones elegidas:</p>
        <ul>${enlacesHTML}</ul>
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



app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});














