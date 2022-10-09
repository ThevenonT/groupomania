const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/** inscrit un nouvel user et hash le mots de passe */
exports.signup = (req, res, next) => {
    //hash le mot de passe 
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            // Créer un user avec l'email et le mot de passe 
            const user = new User({
                email: req.body.email,
                password: hash
            });
            // inscrit l'utilisateur dans la base de donnée
            user.save()
                .then(() => res.status(201).json({ status: 201, message: 'utilisateur créé !' }))
                .catch(error => res.status(500).json({ error, message: 'Un compte est déjà associé à cette email !' }))
        })
        .catch(error => res.status(500).json({ error }));
};

/** vérifie si l'email et le mot de passe son enregistrer dans la bdd */
exports.login = (req, res, next) => {

    /** * Créer un payload aléatoire */
    let payload = Math.random(10).toString(9).split('.')[1];

    console.log(req.body.stayCo);
    console.log('email', req.body.email);

    // vérifie si l'utilisateur fournit l'email administrateur 
    if (req.body.email === process.env.ADMIN_EMAIL) {
        // vérifie si l'utilisateur fournit le mot de passe administrateur 
        if (req.body.password === process.env.ADMIN_PASSWORD) {
            console.log('utilisation du compte administrateur !');
            // return user._id et le token 
            return res.status(200).json({
                status: 200,
                admin: true,
                userId: `${process.env.ADMIN_USERID}`,
                // Créer un token sécurisé 
                token: jwt.sign(
                    { payload: payload, userId: `${process.env.ADMIN_USERID}` },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: `${req.body.stayCo}` }
                )
            });

        } else {
            return res.status(401).json({ error: 'mot de passe incorrect !' });
        }

    } else {
        // vérifie si l'email est enregistré 
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    return res.status(401).json({ error: 'utilisateur non trouvé !' });
                }
                // vérifie le mots de passe fournit 
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (!valid) {
                            return res.status(401).json({ error: 'mot de passe incorrect !' });
                        }

                        // return user._id et le token 
                        return res.status(200).json({
                            status: 200,
                            admin: false,
                            userId: user._id,
                            // Créer un token sécurisé 
                            token: jwt.sign(
                                { payload: payload, userId: user._id },
                                process.env.ACCESS_TOKEN_SECRET,
                                { expiresIn: `${req.body.stayCo}` }
                            )
                        });
                    })
                    .catch((error) => res.status(500).json({ error }))
            })
            .catch((error) => res.status(500).json({ error }))
    }


};


/** vérifie la validité du token de l'utilisateur  */
exports.token = (req, res, next) => {

    try {

        jwt.verify(req.body.token, process.env.ACCESS_TOKEN_SECRET);
        // vérifie si il s'agit du compte administrateur
        if (jwt.verify(req.body.token, process.env.ACCESS_TOKEN_SECRET).userId === process.env.ADMIN_USERID) {

            return res.status(200).json({ status: 200, message: 'token valid !', admin: true })
        }
        return res.status(200).json({ status: 200, message: 'token valid !', admin: false })

    } catch (error) {
        res.status(401).json({ status: 401, message: 'error invalid token !!' })
    }

}