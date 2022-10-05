import React, { useState } from 'react';
import styles from '../../utils/style/pages/connexion/style.module.css';




/**
 * Gère la partie connexion 
 * @param {*} ErrorLogin retourne une erreur si celle-ci se produit
 * @returns connecte l'utilisateur et créer un token 
 */
export const Login = ({ ErrorLogin, setErrorLogin }) => {

    // contient la valeur de l'email saisie par l'utilisateur 
    const [emailValue, setEmailValue] = useState('');
    // contient la valeur du mot de passe saisie par l'utilisateur 
    const [passwordValue, setPasswordValue] = useState('');

    // passe a true si un chargement est nécessaire 
    const [loading, setLoading] = useState(false);


    /**  récupère l'email saisie par l'utilisateur */
    function EmailInput(e) {
        setEmailValue(e.target.value);
    }
    /** récupère l'email saisie par l'utilisateur */
    function PasswordInput(e) {
        setPasswordValue(e.target.value);
    }


    // au click sur se connecter 
    function Submit(event) {

        // active le chargement 
        setLoading(true);

        // supprime le comportement par default  
        event.preventDefault();

        // crée un objet json nommé user 
        let user = {
            email: String(emailValue),
            password: String(passwordValue)
        };
        // initialize les options et ajoute le body de la requête 
        const options = {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Accept': 'application/json',
                "content-type": "application/json"
            },

        };
        // connecte l'utilisateur 
        // requête l'api pour vérifié l'authenticité de l'email et du mot de passe fournie par l'utilisateur 
        fetch("http://localhost:3000/api/auth/login", options)

            .then((response) => response.json())
            .then((response) => {

                // si l'email et le mot de passe son authentique 
                if (response.status === 200) {

                    // enregistre l'userSession dans le localStorage 
                    sessionStorage.setItem('userSession', JSON.stringify({ token: response.token }));
                    // arrête le chargement
                    setLoading(false);
                    // recharge la page 
                    window.location.reload();
                }
                // si l'email ou le mot de passe ne sont pas authentique  
                else {
                    // affiche une erreur 
                    console.log(response);
                    // affiche l'erreur retourné par la requête
                    setErrorLogin(response.error);
                    // arrête le chargement 
                    setLoading(false);
                }

            })
            // si un problème survient avec la requête 
            .catch((error) => {
                // affiche une erreur dans la console 
                console.log("error :" + error);
                // affiche l'erreur retourné 
                setErrorLogin(String(error.message));
                // arrête le chargement 
                setLoading(false);
            })



    }

    return (
        <div className={styles.container}>
            <div className={styles.container_content}>
                <h2 className={styles.title}>Se connecter</h2>
                <form className={styles.form} onSubmit={Submit}>
                    <div className={styles.container_input_text}>
                        {!loading && ErrorLogin !== '' ?
                            <p className={styles.error} id='error'>{ErrorLogin}</p>
                            : <p id='error'>{ErrorLogin}</p>
                        }
                        <input className={styles.input_text} onChange={EmailInput} value={emailValue} type="email" name="email" id="email" placeholder='Exemple@hotmail.com' required />
                        <input className={styles.input_text} onChange={PasswordInput} value={passwordValue} type="password" name="password" id="password" placeholder='Mot de passe' required />
                    </div>
                    {!loading ?
                        <input className={styles.btnSubmit} type="submit" value="Connexion" />
                        :
                        <input className={styles.btnSubmit + ' ' + styles.animValidation} type="submit" value="Connexion" />
                    }
                </form>
            </div>
        </div>
    );
}