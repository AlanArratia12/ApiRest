require('dotenv').config();
const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// Conectar a la base de datos usando variables de entorno
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

// 📌 GET: Obtener todos los usuarios o un usuario específico por ID
router.get('/', (req, res) => {
    let consulta = "SELECT * FROM USUARIO";
    let params = [];

    if (req.query.Id) {
        consulta += " WHERE Id = ?";
        params.push(req.query.Id);
    }

    connection.query(consulta, params, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error en el servidor", detalle: err });
        }
        if (results.length > 0) {
            res.json({ resultado: results });
        } else {
            res.status(404).json({ error: "No se encontraron resultados" });
        }
    });
});

// 📌 DELETE: Eliminar un usuario por ID
router.delete('/:Id', (req, res) => {
    const { Id } = req.params;

    connection.query("DELETE FROM USUARIO WHERE Id = ?", [Id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error al eliminar usuario", detalle: err });
        }
        if (result.affectedRows > 0) {
            res.json({ mensaje: "Usuario eliminado correctamente" });
        } else {
            res.status(404).json({ error: "Usuario no encontrado" });
        }
    });
});

// 📌 POST: Agregar un nuevo usuario
router.post('/', (req, res) => {
    const { Nombre, Correo, Edad } = req.body;

    if (!Nombre || !Correo) { 
        return res.status(400).json({ error: "Se requieren Nombre y Correo" });
    }

    // Si la edad no se envía, la dejamos como NULL
    const edadValor = Edad !== undefined ? Edad : null;

    connection.query(
        "INSERT INTO USUARIO (Nombre, Correo, Edad) VALUES (?, ?, ?)", 
        [Nombre, Correo, edadValor], 
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Error al insertar usuario", detalle: err });
            }
            res.status(201).json({ mensaje: "Usuario agregado correctamente", id: result.insertId });
        }
    );
});

module.exports.router = router;
