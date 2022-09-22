const Sequelize = require('sequelize');
require('dotenv').config();

/**  teste la connexion a la base de donnée mysql  
 * @param DB_name nom de la base de donnée
*/
async function TestConnexionMySql(DB_name) {
    // initialize la connexion a la base de donnée
    const sequelize = new Sequelize(DB_name, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, { dialect: "mysql", host: "localhost", port: '8889' });
    // vérifie la connexion 
    await sequelize.authenticate().then(() => {
        return console.log('Connecté à la base de données MySQL!');

    }).catch((error) => {
        return console.error('Impossible de se connecter, erreur suivante :', error);
    })

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
exports.Query = Query;
