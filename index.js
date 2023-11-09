const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Configuración de express-session
app.use(
  session({
    secret: "my-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(bodyParser.json());
app.use(cors());

// Middleware para verificar si hay una lista de marcas en la sesión, si no, la inicializa
app.use((req, res, next) => {
  if (!req.session.marcas) {
    req.session.marcas = [
      {
        id:1,
        nombre: "Café de la Finca",
        marca: "Juan Valdez",
        img: "https://comprocafedecolombia.com/wp-content/uploads/2021/05/34.-CAUCA-454-G-FRONT.jpg",
      },
      {
        id:2,
        nombre: "Rain Forest",
        marca: "Mariantonia",
        img: "https://cafemariantonia.com/wp-content/uploads/2022/08/Blog-Cafe-con-sello-Rainforest-imagen-684x1024.jpg",
      },
      {
        id:3,
        nombre: "Café Origen Cauca",
        marca: "Juan Valdez",
        img: "https://juanvaldez.com/wp-content/uploads/2022/12/6095b6cef95fc7ddb52baf4b_cafe-origen-cauca-juan-valdez.png",
      },
      {
        id:4,
        nombre: "Sierra Nevada",
        marca: "Juan Valdez",
        img: "https://www.tiendajuanvaldez.com/wp-content/uploads/2022/04/Sierra-nevada.jpg",
      },
      {
        id:5,
        nombre: "Café Origen Antioquia",
        marca: "Juan Valdez",
        img: "https://juanvaldez.com/wp-content/uploads/2022/12/6095b70824b7912dc2a8a914_cafe-origen-antioquia-juan-valdez.png",
      },
    ];
  }
  if (!req.session.opiniones) {
    req.session.opiniones = [
      {
        id: "1",
        idcafe:1,
        nombre: "María Pérez",
        correo: "maria@example.com",
        telefono: "123456789",
        opinion: "Me encanta este café, tiene un sabor increíble.",
      },
      {
        id: "2",
        idcafe:2,
        nombre: "Juan Rodríguez",
        correo: "juan@example.com",
        telefono: "987654321",
        opinion: "Excelente servicio al cliente. ¡Volveré pronto!",
      },
      {
        id: "3",
        idcafe:2,
        nombre: "Ana Gómez",
        correo: "ana@example.com",
        telefono: "456789012",
        opinion: "El ambiente en la cafetería es muy acogedor. Recomendado.",
      },
      {
        id: "4",
        idcafe:3,
        nombre: "Carlos Martínez",
        correo: "carlos@example.com",
        telefono: "345678901",
        opinion: "El café tiene un aroma delicioso. ¡Volveré a probar más variedades!",
      },
      {
        id: "5",
        idcafe:3,
        nombre: "Laura Díaz",
        correo: "laura@example.com",
        telefono: "234567890",
        opinion: "Me gusta la variedad de opciones de café. ¡Una experiencia única!",
      },
    ];
  }
  
  next();
});

// Ruta para obtener la lista de marcas de café
app.get("/marcas", (req, res) => {
  res.json(req.session.marcas);
});

// Ruta para agregar una nueva marca de café
app.post("/marcas", (req, res) => {
  const nuevaMarca = req.body;
  req.session.marcas.push(nuevaMarca);
  res.json({ message: "Marca de café agregada correctamente" });
});

// Ruta para editar una marca de café por su nombre
app.put("/marcas/:nombre", (req, res) => {
  const nombre = req.params.nombre;
  const nuevaInfo = req.body;
  const index = req.session.marcas.findIndex(
    (marca) => marca.nombre === nombre
  );

  if (index !== -1) {
    req.session.marcas[index] = { ...req.session.marcas[index], ...nuevaInfo };
    res.json({ message: "Marca de café editada correctamente" });
  } else {
    res.status(404).json({ message: "Marca de café no encontrada" });
  }
});

// Ruta para eliminar una marca de café por su nombre
app.delete("/marcas/:nombre", (req, res) => {
  const nombre = req.params.nombre;
  const index = req.session.marcas.findIndex(
    (marca) => marca.nombre === nombre
  );

  if (index !== -1) {
    req.session.marcas.splice(index, 1);
    res.json({ message: "Marca de café eliminada correctamente" });
  } else {
    res.status(404).json({ message: "Marca de café no encontrada" });
  }
});

// Consultar todas las opiniones
app.get('/opiniones', (req, res) => {
  const opiniones = req.session.opiniones;
  res.json(opiniones);
});

// Método GET para obtener opiniones relacionadas a un café específico (idcafe = 1)
app.get('/opiniones/:idcafe', (req, res) => {
  const idcafe = req.params.idcafe;
  const opinionesRelacionadas = req.session.opiniones.filter(opinion => opinion.idcafe == idcafe);

  res.json(opinionesRelacionadas);
});

// Crear una nueva opinión
app.post('/opiniones', (req, res) => {
  const nuevaOpinion = req.body;
  req.session.opiniones.push(nuevaOpinion);
  res.json({ message: 'Opinión agregada correctamente' });
});

// Editar una opinión por su identificador (id)
app.put('/opiniones/:id', (req, res) => {
  const id = req.params.id;
  const nuevaInfo = req.body;
  const opiniones = req.session.opiniones;
  const index = opiniones.findIndex(opinion => opinion.id === id);

  if (index !== -1) {
    opiniones[index] = { ...opiniones[index], ...nuevaInfo };
    res.json({ message: 'Opinión editada correctamente' });
  } else {
    res.status(404).json({ message: 'Opinión no encontrada' });
  }
});

// Eliminar una opinión por su identificador (id)
app.delete('/opiniones/:id', (req, res) => {
  const id = req.params.id;
  const opiniones = req.session.opiniones;
  const index = opiniones.findIndex(opinion => opinion.id === id);

  if (index !== -1) {
    opiniones.splice(index, 1);
    res.json({ message: 'Opinión eliminada correctamente' });
  } else {
    res.status(404).json({ message: 'Opinión no encontrada' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
