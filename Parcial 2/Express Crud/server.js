require("dotenv").config();
const express = require('express');
const routerUsuario = require('./Routes/UsuarioRouter');
const app = express();

// Usar el puerto desde las variables de entorno o 3000 por defecto
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.text());

app.use('/usuario', routerUsuario.router);

app.use('/', (req, res, next) => {
    res.status(404).send("Error 404");
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});