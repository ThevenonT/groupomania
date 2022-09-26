const { createServer } = require("http");
const app = require('./app');
require('dotenv').config();
const cors = require('cors');


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

app.use(cors())

// se connecte au socket-client 
const io = require("socket.io")(httpServer, {
    cors: {
        origin: "*",
    },
});
// initialize le tableau des utilisateur connecté 
let userCo = [];

// s'execute a la connexion du client sur le server
io.on('connection', (client) => {
    // écoute l'évènement connexion 
    client.on('connexion', (userId) => {


        // ajoute l'id de connexion dans le tableau des utilisateur connecté 
        userCo.push({ id: client.id, userId: userId })

        // envoie le tableau des utilisateur connecté a tous les client connecté 
        io.emit('userCo', userCo)
        console.log('co');
    })

    // écoute l'évènement disconnect 
    client.on('disconnect', (e) => {
        // si l'utilisateur est présent dans le tableau des utilisateur connecté
        if (userCo.filter(user => user.id === client.id).length > 0) {

            console.log('deco');
            // retire l'id de l'utilisateur du tableau des utilisateur connecté 
            userCo = userCo.filter(user => user.id !== client.id);
            // envoie le tableau des utilisateur connecté a tous les client connecté 
            io.emit('userCo', userCo.filter(user => user.id !== client.id))
        }

    });
})

httpServer.listen(port);
