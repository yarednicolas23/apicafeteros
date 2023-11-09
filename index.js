const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");

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

app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
