const http = require('http');

const server = http.createServer((req, res) => {
    //res.writeHead(200,{'Access-Control-Allow-Origin':'*'});
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>MI SERVIDOR DE NODE CORRIENDO EN EL PUERTO 3000</h1>');
});

server.listen(3000, () => {
    console.log("🚀 Servidor Node.js corriendo en http://localhost:3000/");
});
