const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Sql = require('./utils/connectMySql');

/**  Route user 
    ** Gère la création de compte, la connexion de l'utilisateur
    ** et la création d'un token sécurisé.
*/
const userRoutes = require('./routes/user');
const profilRoutes = require('./routes/profil');
const postRoutes = require('./routes/post');

const path = require('path');
require('dotenv').config();

// parse le corps des requête 
app.use(express.json());

// teste la connexion a la base de donnée mysql 
Sql.TestConnexionMySql('groupomania')
    .then(async (result) => {
        // si le résultat est false
        if (result === false) {
            // Créer une base de donnée 
            Sql.CreatedBddMySql('groupomania')
                .then((res) => {
                    // si la base de donnée a bien été créer 
                    if (res === true) {
                        Sql.TestConnexionMySql('groupomania');
                    }
                })
        }
    })


/* connection a la base de donnée mongoDB */
mongoose.connect(process.env.CONNEXION_MONGO_DB,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !✅'))
    .catch((err) => console.log('Connexion à MongoDB échouée !❌', err));



// declaration du header pour les requête
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
});


// redirection des routes 
app.use('/api/auth', userRoutes);
app.use('/api/profil', profilRoutes);
app.use('/api/post', postRoutes);

// ajout du chemin static 
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;