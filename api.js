var http = require('http');
var axios = require('axios');

const PORT = process.env.PORT || 3000;

var httpServer = http.createServer(function(request, response) {
    // Faire une requête à l'API externe
    axios.get('https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m,wind_speed_10m,wind_direction_10m,wind_gusts_10m&timezone=Europe%2FBerlin')
        .then(apiResponse => {
            // Renvoyer la réponse de l'API à l'utilisateur
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.write(JSON.stringify(apiResponse.data));
            response.end();
        })
        .catch(error => {
            console.error("Error fetching data from API:", error);
            response.writeHead(500, { 'Content-Type': 'text/plain' });
            response.write("Internal Server Error");
            response.end();
        });
});

// Écoute du serveur HTTP
httpServer.listen(PORT, () => {
    console.log("Server is running at port 3000...");
});
