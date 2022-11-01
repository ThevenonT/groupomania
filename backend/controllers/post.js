const Sql = require('../utils/connectMySql');
const fs = require('fs');

// affiche les post
exports.getAllPost = (req, res, next) => {

    Sql.Query('groupomania', `SELECT * FROM post ORDER BY id DESC`)
        .then((response) => {

            return res.status(200).json({ status: 200, response })
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({ err, status: 400, message: 'il y a un problème !!' })
        })
}

// affiche les post de l'utilisateur 
exports.getAllPostOneUser = (req, res, next) => {
    console.log('body', req.auth.userId);

    Sql.Query('groupomania', `SELECT * FROM post WHERE userId = '${req.auth.userId}' ORDER BY id DESC`)
        .then((response) => {

            return res.status(200).json({ status: 200, response })
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({ err, status: 400, message: 'il y a un problème !!' })
        })
}

// ajoute un post  
exports.AddPostData = (req, res, next) => {

    console.log('body', req.auth.userId);
    // eslint-disable-next-line no-useless-concat
    Sql.Query('groupomania', `INSERT INTO post (id, userId, date, heure, image, description, usersliked, usersdisliked) VALUES (NULL, "${req.auth.userId}", "${req.body.date}", "${req.body.heure}", "${req.file.path}", "${req.body.description}", '[]', '[]');`)
        .then((response) => {

            return res.status(200).json({ status: 200, message: 'post ajouté !!', img: req.file.path, id: response, userId: req.auth.userId })
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({ err, status: 400, message: 'il y a un problème !!' })
        })
}

exports.ModifyPostData = (req, res, next) => {

    console.log('body', req.auth.userId);
    // eslint-disable-next-line no-useless-concat

    Sql.Query('groupomania', `UPDATE post SET (id, userId, date, heure, image, description, usersliked, usersdisliked) VALUES (NULL, "${req.auth.userId}", "${req.body.date}", "${req.body.heure}", "${req.file.path}", "${req.body.description}", "${req.body.usersliked}", "${req.body.usersdisliked}");`)
        .then((response) => {

            return res.status(200).json({ status: 200, message: 'post ajouté !!', img: req.file.path, id: response, userId: req.auth.userId })
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({ err, status: 400, message: 'il y a un problème !!' })
        })
}

exports.DeletedPostData = (req, res, next) => {

    console.log('body', req.auth.userId);

    // eslint-disable-next-line no-useless-concat

    Sql.Query('groupomania', `DELETE FROM post WHERE post.id = ${req.body.id}`)
        .then((response) => {
            // récupère le nom de l'image
            const filename = req.body.post.image.split('images/')[1];
            // supprime l'image du 
            fs.unlink(`images/${filename}`, () => {

                return res.status(200).json({ status: 200, message: 'post supprimé !!', })
            })
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({ err, status: 400, message: 'il y a un problème !!' })
        })
}



/** * Gère la demande utilisateur 
    ** si l'utilisateur ajoute un like = 1 -> addLike() 
    ** si l'utilisateur ajoute un dislike = -1 -> addDislike()
*/
exports.likes = (req, res) => {
    // id de l'utilisateur
    const userId = req.auth.userId;
    console.log(userId);
    // id de la sauce 
    const id = req.body.id;
    console.log(req.body);


    const usersliked = req.body.usersliked;

    const usersdisliked = req.body.usersdisliked;

    // gère le système de like 
    switch (req.body.like) {
        case 1:
            addLike(res, id, userId, usersliked, usersdisliked);
            break;
        case -1:
            addDislike(res, id, userId, usersliked, usersdisliked);
            break;

    };
};

/** ajoute un like et enregistre l'id de l'utilisateur dans le tableau de like
 * @param {*} res réponse au de la requête
 * @param {*} Id id du post concernée 
 * @param {*} userId id de l'utilisateur concernée 
 */
function addLike(res, id, userId, usersliked, usersdisliked) {
    console.log('user', userId);
    console.log('userdislike', usersdisliked);
    console.log('userdislike', usersdisliked.length);
    console.log('userlike', usersliked);

    let like;
    let message;
    // si l'utilisateur like et qu'un dislike est déjà présent
    if (usersdisliked.length > 0 && usersdisliked.filter((user) => user === userId).length > 0) {
        // retire l'utilisateur du tableau des dislike 
        usersdisliked = usersdisliked.filter((user) => user !== userId)
        message = 'dislike retiré !';
        like = 'none';
    }

    // si l'utilisateur a déjà like 
    if (usersliked.length > 0 && usersliked.filter((user) => user === userId).length > 0) {
        // retire l'utilisateur du tableau des like 
        usersliked = usersliked.filter((user) => user !== userId)
        message = 'like retiré !';
        like = 'none';

    } else
        if (usersliked !== undefined) {
            // ajoute l'utilisateur au tableau des like et les utilisateur déjà présent 
            usersliked = [userId, ...usersliked];
            message = 'like ajouté !';
            like = 'true';
            // si aucun utilisateur n'est présent dans le tableau des like 
        } else {
            // ajoute l'utilisateur dans le tableau
            usersliked = [userId];
            message = 'like ajouté !';
            like = 'true';
        }









    console.log(JSON.stringify(usersliked));
    // eslint-disable-next-line no-useless-concat
    Sql.Query('groupomania', `UPDATE post SET usersliked = '${JSON.stringify(usersliked)}', usersdisliked = '${JSON.stringify(usersdisliked)}' WHERE post.id = '${id}';`)
        .then(() => {
            return res.status(200).json({ status: 200, like: like, message: message, userId: userId, usersliked: usersliked, usersdisliked: usersdisliked, id: id })
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({ err, status: 400, message: 'il y a un problème !!' })
        })

}

/** ajoute un dislike et enregistre l'id de l'utilisateur dans le tableau de dislike
 * @param {*} res réponse au de la requête
 * @param {*} sauceId id de la sauce concernée 
 * @param {*} userId id de l'utilisateur concernée 
 */
function addDislike(res, id, userId, usersliked, usersdisliked) {

    let dislike;
    let message;


    // si l'utilisateur dislike et qu'un like est déjà présent 
    if (usersliked.length > 0 && usersliked.filter((user) => user === userId).length > 0) {
        // retire l'utilisateur du tableau des like 
        usersliked = usersliked.filter((user) => user !== userId)
        message = 'like retiré !'
        dislike = 'none';
    }


    // si l'utilisateur a déjà dislike 
    if (usersdisliked.length > 0 && usersdisliked.filter((user) => user === userId).length > 0) {
        // retire l'utilisateur du tableau des dislike
        usersdisliked = usersdisliked.filter((user) => user !== userId)
        message = 'dislike retiré !'
        dislike = 'none';

    } else
        // si le tableau des dislike n'est pas undefined
        if (usersdisliked !== undefined) {
            // ajoute l'userId de l'utilisateur suivie des userId déjà présent 
            usersdisliked = [userId, ...usersdisliked]
            message = 'dislike ajouté !'
            dislike = 'false';
        } else {
            // ajoute l'userId de l'utilisateur dans le tableau de dislike 

            usersdisliked = [userId]
            message = 'dislike ajouté !'
            dislike = 'false';
        }



    console.log(JSON.stringify(usersdisliked));

    // eslint-disable-next-line no-useless-concat
    Sql.Query('groupomania', `UPDATE post SET usersliked = '${JSON.stringify(usersliked)}', usersdisliked = '${JSON.stringify(usersdisliked)}' WHERE post.id = '${id}';`)
        .then((response) => {

            return res.status(200).json({ status: 200, like: dislike, message: message, userId: userId, usersliked: usersliked, usersdisliked: usersdisliked, id: id })
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({ err, status: 400, message: 'il y a un problème !!' })
        })

}


