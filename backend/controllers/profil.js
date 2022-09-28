const Sql = require('../utils/connectMySql');


// récupère le profils de tout les utilisateurs 
exports.getAllProfils = (req, res) => {

    Sql.Query('groupomania', `SELECT * FROM profils`)
        .then((response) => {

            return res.status(200).json({ status: 200, response })
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({ err, status: 500, message: 'il y a un problème !!' })
        })
}

// récupère le profils d'un l'utilisateur 
exports.getOneData = (req, res) => {

    const userId = req.auth.userId;

    console.log('userId', userId);

    Sql.Query('groupomania', `SELECT * FROM profils WHERE userId LIKE '${userId}'`)
        .then((response) => {

            return res.status(200).json({ status: 200, response })
        })
        .catch((err) => {
            console.log(err);
            return res.status(400).json({ err, status: 400, message: 'il y a un problème !!' })
        })
}

// ajoute un profils utilisateur 
exports.AddProfilsData = (req, res) => {
    console.log(req.body);
    const userId = req.auth.userId;
    let file;
    if (req.file === undefined) {
        file = 'images/profil/default/profils_default2.png'
    } else {
        file = req.file.path;
    }
    // eslint-disable-next-line no-useless-concat
    Sql.Query('groupomania', `INSERT INTO profils (id, nom, prenom, description, image, userId) VALUES (NULL, '${req.body.nom}', '${req.body.prenom}', '${req.body.description}', '${file}', '${userId}');`)
        .then((response) => {
            console.log(response)
            return res.status(200).json({ status: 200, message: 'profils configuré !!' })
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({ err, status: 500, message: 'il y a un problème !!' })
        })
}