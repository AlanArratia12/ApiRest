xmlparser = require('express-xml-bodyparser');
const express=require('express');
const app=express();
const port=3000;
const multer=require('multer');
const path = require('path');
const mysql = require('mysql2');





/*Middlewawre de Aplicacion
app.use('/',(req,res,next)=>{
console.log("Peticion al server");
next();
}, (req,res,next)=>{
    console.log("2da funcion middlewawre");
    next();
}
);
 */
 
// Middleware incorporado en express
app.use(express.json());
app.use(express.text());
app.use(xmlparser());

const folder = path.join(__dirname, '/archivos/'); 
const upload = multer({ dest: folder });
app.use(upload.single('archivo'));

app.post('/prefecto', (req,res,next)=>{
    //console.log(req.body);
    //res.send("Metodo POST");
    console.log(`Se recibio el archivo: ${req.file.originalname}`);
    console.log(req.body);
    console.log('Se recibio el formulario:'+JSON.stringify(req.body));
    res.json(req.body);
});

app.get('/alumnos', (req,res,next)=>{
    console.log(req.query);
    res.sendFile(__dirname+'/index.html');
})
 
app.post('/sistemas/:control', (req,res)=>{
    console.log(req.params)
    res.send("Metodo POST");
})
 
app.get('/maestros', (req,res)=>{
    console.log(req.body)
    res.send("Hola Mundo!");
})
 
app.use('/', (req,res,next)=>{
    res.status(404);
    res.send("Error 404");
})
 
app.listen(port,()=>{
console.log('Server running at http://localhost:3000');
});