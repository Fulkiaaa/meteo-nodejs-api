var http = require('http');
var https = require('https');
const PORT = process.env.PORT || 3000;

var httpServer = http.createServer(function(request, response) {

    // Faire une requête à l'API externe
    function getData(callback){
        var apiRequest = https.request('https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m,wind_speed_10m,wind_direction_10m,wind_gusts_10m&timezone=Europe%2FBerlin', function(apiResponse) {
            var data = '';
            apiResponse.on('data', function(chunk) {
                data += chunk;
            });
            apiResponse.on('end', function() {
                callback(data);
            });
        });
        apiRequest.on('error', function(error) {
            console.error("Error fetching data from API:", error);
            response.writeHead(500, { 'Content-Type': 'text/plain' });
            response.write("Internal Server Error");
            response.end();
        });
        apiRequest.end();
    }

     // Ajouter les en-têtes CORS
     response.setHeader('Access-Control-Allow-Origin', '*');
     response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
     response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Appeler la fonction pour récupérer les données
    getData(function(data) {
        // Envoyer les données au client
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.write(data);
        response.end();
    });
});

// Écoute du serveur HTTP
httpServer.listen(PORT, () => {
    console.log("Server is running at port", PORT);
});
