const Sql = require('../utils/connectMySql');
const fs = require('fs');
const User = require('../models/User');

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
    Sql.Query('groupomania', `INSERT INTO profils (id, nom, prenom, description, image, userId) VALUES (NULL, "${req.body.nom}", "${req.body.prenom}", "${req.body.description}", "${file}", "${userId}");`)
        .then((response) => {
            console.log(response)
            return res.status(200).json({ status: 200, message: 'profils configuré !!' })
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({ err, status: 500, message: 'il y a un problème !!' })
        })
}

// ajoute un profils utilisateur 
exports.ModifyProfilsData = (req, res) => {


    let file;
    if (req.file === undefined) {
        file = req.body.imageUrl
    } else {
        file = req.file.path;
    }
    // récupère le nom de l'image
    const filename = req.body.imageUrl.split('images/')[1];

    // vérifie si il s'agit du compte administrateur 
    if (req.body.id === '1') {
        return res.status(401).json({ status: 401, message: 'impossible de supprimé le compte administrateur !' })
    }

    Sql.Query('groupomania', `UPDATE profils SET nom = "${req.body.nom}", prenom = "${req.body.prenom}", description = "${req.body.description}", image = "${file}" WHERE profils.id = ${req.body.id};`)
        .then(() => {

            if (req.file !== undefined) {
                // supprime l'image du 
                fs.unlink(`images/${filename}`, () => {


                    return res.status(200).json({ status: 200, message: 'profils configuré !!' })

                })
            } else {
                return res.status(200).json({ status: 200, message: 'profils configuré !!' })
            }
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({ err, status: 500, message: 'il y a un problème !!' })
        })
}

// supprime toute les informations de l'utilisateur 
exports.deleted = (req, res) => {
    // vérifie si il s'agit du compte administrateur 
    if (req.body.user_profil.userId === process.env.ADMIN_USERID) {
        return res.status(401).json({ status: 401, message: 'impossible de supprimé le compte administrateur !' })
    }
    console.log(req.body);
    // récupère tout les poste de l'utilisateur dans un tableau 
    Sql.Query('groupomania', ` SELECT * FROM post WHERE post.userId = '${req.body.user_profil.userId}'`)
        .then((response) => {

            console.log(response);

            // se répète autant de fois qui il y de post dans le tableau 
            if (response.length > 0) {
                for (let i = 0; i < response.length; i++) {

                    // récupère le nom de l'image
                    const filename = response[i].image.split('images/')[1];

                    // supprime l'image du dossier 
                    fs.unlink(`images/${filename}`, () => {

                        // vérifie que toute les images présente dans les poste de l'utilisateur on été supprimé
                        // s'execute a la dernière boucle du for
                        if (response.length - 1 === i) {
                            console.log('toute les image du post on été supprimé !');
                            // supprime tous les post de l'utilisateur 
                            Sql.Query('groupomania', `DELETE FROM post WHERE post.userId = '${req.body.user_profil.userId}'`)
                                .then((response) => {

                                    console.log('ok');

                                })
                                .catch((err) => {
                                    console.log(err);
                                    return res.status(500).json({ err, status: 500, message: 'il y a un problème !!' })
                                })
                        }
                    })

                }
            }


            // supprime le profil de l'utilisateur 
            Sql.Query('groupomania', `DELETE FROM profils WHERE profils.userId = '${req.body.user_profil.userId}'`)
                .then((response) => {

                    console.log('ok');
                    // récupère le nom de l'image
                    const filename = req.body.user_profil.image.split('images/')[1];

                    // vérifie si l'image n'est pas celle par default
                    if (String(filename) !== 'profil/default/profils_default2.png') {
                        // supprime l'image du profil
                        fs.unlink(`images/${filename}`, () => {
                            console.log('img profil supprimé !');
                            // supprime le compte de l'utilisateur 
                            User.remove({ _id: req.body.user_profil.userId })
                                .then((user) => {
                                    console.log(user);

                                    return res.status(200).json({ status: 200, msg: 'compte supprimé !' })

                                })
                        })
                    } else {
                        // supprime le compte de l'utilisateur 
                        User.remove({ _id: req.body.user_profil.userId })
                            .then((user) => {
                                console.log(user);

                                return res.status(200).json({ status: 200, msg: 'compte supprimé !' })

                            })
                    }

                })
                .catch((err) => {
                    console.log(err);
                    return res.status(500).json({ err, status: 500, message: 'il y a un problème !!' })
                })




        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({ err, status: 500, message: 'il y a un problème !!' })
        })


}