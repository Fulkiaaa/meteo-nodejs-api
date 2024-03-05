var http = require('http');
var https = require('https');
const PORT = process.env.PORT || 3000;

// Fonction pour calculer la force du vent en beauforts
function calculateBeaufort(windSpeed) {
    // Utilisation de la formule de calcul de la force du vent en beauforts
    if (windSpeed < 0.3) {
        return 0;
    } else if (windSpeed >= 0.3 && windSpeed < 1.6) {
        return 1;
    } else if (windSpeed >= 1.6 && windSpeed < 3.4) {
        return 2;
    } else if (windSpeed >= 3.4 && windSpeed < 5.5) {
        return 3;
    } else if (windSpeed >= 5.5 && windSpeed < 8.0) {
        return 4;
    } else if (windSpeed >= 8.0 && windSpeed < 10.8) {
        return 5;
    } else if (windSpeed >= 10.8 && windSpeed < 13.9) {
        return 6;
    } else if (windSpeed >= 13.9 && windSpeed < 17.2) {
        return 7;
    } else if (windSpeed >= 17.2 && windSpeed < 20.8) {
        return 8;
    } else if (windSpeed >= 20.8 && windSpeed < 24.5) {
        return 9;
    } else if (windSpeed >= 24.5 && windSpeed < 28.5) {
        return 10;
    } else if (windSpeed >= 28.5 && windSpeed < 32.7) {
        return 11;
    } else {
        return 12;
    }
}

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
        // Parse les données JSON
        const weatherData = JSON.parse(data);
        
        // Modifier les données pour ajouter la force du vent en beauforts
        weatherData.hourly.beaufort_scale = [];
        weatherData.hourly.wind_speed_10m.forEach(windSpeed => {
            const beaufort = calculateBeaufort(windSpeed);
            weatherData.hourly.beaufort_scale.push(beaufort);
        });

        // Envoyer les données modifiées au client
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.write(JSON.stringify(weatherData));
        response.end();
    });
});

// Écoute du serveur HTTP
httpServer.listen(PORT, () => {
    console.log("Server is running at port", PORT);
});
