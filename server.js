const http = require('http');
const fs = require('fs');
const PORT = process.env.PORT || 3000;

// Créer le serveur HTTP
const httpServer = http.createServer((request, response) => {
    // Lire le fichier index.html et le servir
    fs.readFile(__dirname + '/index.html', (err, data) => {
        if (err) {
            response.writeHead(500, {'Content-Type': 'text/plain'});
            response.end('Internal Server Error');
        } else {
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.end(data);
        }
    });
});

// Écoute du serveur HTTP
httpServer.listen(PORT, () => {
    console.log("Server is running at port", PORT);
});
