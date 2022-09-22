const { createServer } = require("http");
const app = require('./app');
require('dotenv').config();



// initialize le port 
const normalizePort = val => {

    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};

// vérifie si un port est déclaré dans le fichier .env 
const port = normalizePort(process.env.PORT || '3000');

// initialize un nouveau serveur 
const httpServer = createServer(app);

// si une erreur se produit
const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = httpServer.address();

    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

// démarre le server
httpServer.on('error', errorHandler);


httpServer.on('listening', () => {
    // récupère l'adresse du server
    const address = httpServer.address();
    console.log(address);
    // retourne le port du serveur 
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    // indication d'initialization 
    console.log('Listening on ' + bind);
});

// ajoute le port a utilisé dans les paramètre 
app.set('port', port);



httpServer.listen(port);
