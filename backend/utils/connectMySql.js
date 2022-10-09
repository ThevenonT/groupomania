const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

/**
 ** teste la connexion a la base de donnée mysql 
 ** créer les table nécessaire au fonctionnement si celle-ci ne sont pas présente
 * @param DB_name nom de la base de donnée
*/
async function TestConnexionMySql(DB_name) {

    let Result;
    // initialize la connexion a la base de donnée
    const sequelize = new Sequelize(DB_name, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, { dialect: "mysql", host: "localhost", port: '8889' });

    const queryInterface = sequelize.getQueryInterface();

    /** créer la table profils si elle n'existe pas */
    async function CreatedTableProfils() {

        let res;
        // créer la table profils
        await queryInterface.createTable('profils', {
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            nom: DataTypes.STRING,
            prenom: DataTypes.STRING,
            description: DataTypes.STRING,
            image: DataTypes.STRING,
            userId: DataTypes.STRING

        })
            // si la table a bien été créer return la function CreatedTablePost()
            .then(() => {
                // si la connexion est établie 
                sequelize.authenticate().then(async () => {
                    await sequelize.query(`SELECT * FROM profils WHERE userId = '${process.env.ADMIN_USERID}'`)
                        .then(async (result) => {

                            // si le profil administrateur n'est pas déclaré 
                            if (result[0].length === 0) {

                                // fait la requête sql 
                                await sequelize.query(`INSERT INTO profils (id, nom, prenom, description, image, userId) VALUES (NULL, 'Administrateur', ' ', 'se compte est le compte administrateur ', 'images/profil/default/profils_default2.png', '${process.env.ADMIN_USERID}');`)
                                    .then(async () => { CreatedTablePost() })
                                    .catch(error => { return console.log('il y a un problème !!! : ', error) })
                            }

                            CreatedTablePost()

                        })
                })
                    .catch(error => { return console.error('Impossible de se connecter, erreur suivante :', error); })
            })
            // si une erreur survient return false
            .catch(error => { if (error !== undefined) { return res = false; } })

        return res
    }


    /** crée la table post si elle existe pas */
    function CreatedTablePost() {
        let res;
        // créer la table post si elle n'existe pas 
        queryInterface.createTable('post', {
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            userId: DataTypes.STRING,
            date: DataTypes.STRING,
            heure: DataTypes.STRING,
            image: DataTypes.STRING,
            description: DataTypes.STRING,
            usersliked: DataTypes.STRING,
            usersdisliked: DataTypes.STRING

        })
            // return true si elle a bien été créer
            .then(() => { console.log('Connexion a mySql réussie !'); return res = true; })
            // si une erreur survient return false 
            .catch(error => {
                if (error !== undefined) {
                    return res = false;
                }
            })
        return res
    }

    // appelle de la function CreatedTableProfils()
    await CreatedTableProfils()
        .then((result) => { return Result = result })
        .catch(() => { return Result = false })



    // réponse de la function
    return Result;

}


/** créer un base de donnée 
 * @param {*} DB_name nom de la base de donnée a créer 
 * @returns true si la base de donnée a bien été créer 
 */
async function CreatedBddMySql(DB_name) {

    let Result;
    // initialize la connexion a la base de donnée
    const sequelize = new Sequelize('mysql', process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, { dialect: "mysql", host: "localhost", port: '8889' });
    // envoie de la requête pour créer la base de donnée
    await sequelize.query("CREATE DATABASE " + DB_name)
        .then(() => { return Result = true })
        .catch(() => { return Result = false })

    // réponse de la fonction 
    return Result;

}


/** 
 * @param {*} DB_name nom de la base de donnée mysql
 * @param {*} SQL_req requête sql  
 * @returns le résultat de la requête 
 */
async function Query(DB_name, SQL_req) {
    // initialize la connexion a la base de donnée
    const sequelize = new Sequelize(DB_name, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, { dialect: "mysql", host: "localhost", port: '8889' });


    let Result;

    // si la connexion est établie 
    await sequelize.authenticate().then(async () => {
        // fait la requête sql 
        await sequelize.query(SQL_req)
            .then(async ([results]) => {
                Result = results;
            })
            .catch(error => {
                return console.log('il y a un problème !!! : ', error)
            })

    }).catch(error => {

        return console.error('Impossible de se connecter, erreur suivante :', error);
    })
    return Result;



}


exports.TestConnexionMySql = TestConnexionMySql;
exports.CreatedBddMySql = CreatedBddMySql;
exports.Query = Query;
