var http = require('http');
var fs = require('fs');

http.createServer(function (req, res) {
    fs.readFile('index.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
    });
    //res.writeHead(200, {'Content-Type': 'text/plain'});
    //res.end('Hello World!');
}).listen(8080);

//res.writeHead(200, {'Content-Type': 'text/plain'});
//res.end('Hello World!');

// Agrega información a un archivo edeterminado. Si el archivo no existe, lo crea
/*
fs.appendFile('mynewfile1.txt', 'Hello content!', function (err) {
    if (err) throw err;
    console.log("Saved!");
})
*/

// Si el archivo no existe, crea uno vacío | con argumento en modo apertura
/*
fs.open('mynewfile2.txt', 'w', function (err, file) {
    if (err) throw err;
    console.log("Saved!");
})
*/

// Si el archivo existe lo reabre y reemplaza su contenido, si no existe crea uno nuevo con el contenido especificado
/*
fs.writeFile('mynewfile3.txt', 'Hello content!', function (err) {
    if (err) throw err;
    console.log("Saved!");
})
*/
