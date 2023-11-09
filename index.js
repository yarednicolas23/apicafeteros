const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(bodyParser.json()); // support json encoded bodies
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(cors());
app.use(express.json());

// Ruta para obtener la lista de marcas de café
app.get('/marcas', (req, res) => {
  const marcas = JSON.parse(fs.readFileSync('marcas.json', 'utf-8'));
  res.json(marcas);
});

// Ruta para agregar una nueva marca de café
app.post('/marcas', (req, res) => {
  const nuevaMarca = req.body;
  const marcas = JSON.parse(fs.readFileSync('marcas.json', 'utf-8'));
  marcas.push(nuevaMarca);
  fs.writeFileSync('marcas.json', JSON.stringify(marcas, null, 2));
  res.json({ message: 'Marca de café agregada correctamente' });
});

// Ruta para editar una marca de café por su nombre
app.put('/marcas/:nombre', (req, res) => {
  const nombre = req.params.nombre;
  const nuevaInfo = req.body;
  const marcas = JSON.parse(fs.readFileSync('marcas.json', 'utf-8'));
  const index = marcas.findIndex(marca => marca.nombre === nombre);

  if (index !== -1) {
    marcas[index] = { ...marcas[index], ...nuevaInfo };
    fs.writeFileSync('marcas.json', JSON.stringify(marcas, null, 2));
    res.json({ message: 'Marca de café editada correctamente' });
  } else {
    res.status(404).json({ message: 'Marca de café no encontrada' });
  }
});

// Ruta para eliminar una marca de café por su nombre
app.delete('/marcas/:nombre', (req, res) => {
  const nombre = req.params.nombre;
  const marcas = JSON.parse(fs.readFileSync('marcas.json', 'utf-8'));
  const index = marcas.findIndex(marca => marca.nombre === nombre);

  if (index !== -1) {
    marcas.splice(index, 1);
    fs.writeFileSync('marcas.json', JSON.stringify(marcas, null, 2));
    res.json({ message: 'Marca de café eliminada correctamente' });
  } else {
    res.status(404).json({ message: 'Marca de café no encontrada' });
  }
});

app.listen(process.env.PORT || 2800, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});

module.exports = app