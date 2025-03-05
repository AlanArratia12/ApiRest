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
            // 📌 Agregamos los enlaces HATEOAS para cada usuario en la respuesta
            const usuariosConLinks = results.map(user => ({
                ...user,
                _links: {
                    self: { href: `/usuario/${user.Id}` },  // Enlace para ver el usuario
                    delete: { href: `/usuario/${user.Id}` }, // Enlace para eliminar el usuario
                    update: { href: `/usuario/${user.Id}` }  // Enlace para editar el usuario
                }
            }));

            res.json({ resultado: usuariosConLinks });
        } else {
            res.status(404).json({ error: "No se encontraron resultados" });
        }
    });
});

// 📌 GET: Obtener un usuario específico por ID
router.get('/:Id', (req, res) => {
    const { Id } = req.params;

    connection.query("SELECT * FROM USUARIO WHERE Id = ?", [Id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error en el servidor", detalle: err });
        }
        if (results.length > 0) {
            const user = results[0];
            // 📌 Agregamos los enlaces HATEOAS para el usuario específico
            user._links = {
                self: { href: `/usuario/${user.Id}` },  // Enlace para ver el usuario
                update: { href: `/usuario/${user.Id}` }, // Enlace para editar el usuario
                delete: { href: `/usuario/${user.Id}` }  // Enlace para eliminar el usuario
            };
            res.json({ usuario: user });
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

    const edadValor = Edad !== undefined ? Edad : null;

    connection.query(
        "INSERT INTO USUARIO (Nombre, Correo, Edad) VALUES (?, ?, ?)", 
        [Nombre, Correo, edadValor], 
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Error al insertar usuario", detalle: err });
            }
            const nuevoUsuario = {
                id: result.insertId,
                Nombre,
                Correo,
                Edad: edadValor
            };
            // 📌 Agregamos los enlaces HATEOAS para el nuevo usuario
            nuevoUsuario._links = {
                self: { href: `/usuario/${nuevoUsuario.id}` },  // Enlace para ver el nuevo usuario
                delete: { href: `/usuario/${nuevoUsuario.id}` }, // Enlace para eliminar el nuevo usuario
                update: { href: `/usuario/${nuevoUsuario.id}` }  // Enlace para editar el nuevo usuario
            };
            res.status(201).json({ mensaje: "Usuario agregado correctamente", usuario: nuevoUsuario });
        }
    );
});

// 📌 DELETE: Eliminar un usuario por ID
router.delete('/:Id', (req, res) => {
    const { Id } = req.params;

    connection.query("DELETE FROM USUARIO WHERE Id = ?", [Id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error al eliminar usuario", detalle: err });
        }
        if (result.affectedRows > 0) {
            res.json({
                mensaje: "Usuario eliminado correctamente",
                // 📌 Agregamos enlaces HATEOAS en la respuesta de eliminación
                _links: {
                    add_user: { href: "/usuario" },    // Enlace para agregar un nuevo usuario
                    users_list: { href: "/usuario" }   // Enlace para ver la lista de usuarios
                }
            });
        } else {
            res.status(404).json({ error: "Usuario no encontrado" });
        }
    });
});

module.exports.router = router;

