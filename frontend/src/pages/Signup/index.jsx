import React, { useState } from 'react';
import styles from '../../utils/style/pages/connexion/style.module.css'


/**
 * Gère la partie créer un compte 
 * @param {*} setErrorLogin retourne une erreur si celle-ci se produit
 * @param {*} setSignupState   passe a true si l'utilisateur clique sur créer un compte 
 */
export const Signup = ({ setErrorLogin, setSignupState }) => {

    const [emailValue, setEmailValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const [rePasswordValue, setRePasswordValue] = useState('');
    const [ErrorSignup, setErrorSignup] = useState('');
    const [loading, setLoading] = useState(false);


    /**  récupère l'email saisie par l'utilisateur */
    function EmailInput(e) {
        setEmailValue(e.target.value)
    }
    /** récupère l'email saisie par l'utilisateur */
    function PasswordInput(e) {
        setPasswordValue(e.target.value)
    }
    function rePasswordInput(e) {
        setRePasswordValue(e.target.value)
    }
    function Errors(value) {
        setErrorSignup(value);
    }
    // au click sur submit
    function Submit(event) {
        // indique a l'utilisateur de patienté !
        setErrorSignup('merci de patienté !');

        // active le chargement 
        setLoading(true);

        // supprime le comportement par default  
        event.preventDefault();

        // vérifie si l'utilisateur a tapé deux fois le même mots de passe 
        if (passwordValue !== rePasswordValue) {
            return Errors('merci de vérifié le mot de passe ')
        }

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

        // requête le server avec les information de création de compte 
        fetch("http://localhost:3000/api/auth/signup", options)

            .then((response) => response.json())
            .then((response) => {
                console.log(response);

                // si l'email et le mot de passe son valide  
                if (response.status === 201) {
                    // indique a l'utilisateur de se connecté 
                    setErrorLogin('merci de vous connectez !!');
                    // affiche la page login
                    setSignupState(false);
                }
                // si l'email ou le mot de passe ne sont pas authentique  
                else {
                    // arrête le chargement 
                    setLoading(false);
                    // affiche une erreur 
                    setErrorSignup(response.message);
                }

            })
            // si un problème survient avec la requête 
            .catch((error) => {
                // affiche une erreur dans la console 
                console.log("error :" + error);
                // arrête le chargement 
                setLoading(false);
                // affiche une erreur 
                setErrorLogin(String(error.message));
            })
        // arrête le chargement 
        setLoading(false);

    }
    return (
        <div className={styles.container}>
            <div className={styles.container_content}>
                <h2 className={styles.title}>Créer un Compte</h2>
                <form className={styles.form} onSubmit={Submit}>
                    <div className={styles.container_input_text}>
                        {ErrorSignup !== ''
                            ? <p className={styles.error} id='error'>{ErrorSignup}</p>
                            : <p id='error'>{ErrorSignup}</p>
                        }

                        <input className={styles.input_text} onChange={EmailInput} value={emailValue} type="email" name="email" id="email" placeholder='Exemple@hotmail.com' required />
                        <input className={styles.input_text} onChange={PasswordInput} value={passwordValue} type="password" name="password" id="password" placeholder='mot de passe' required />
                        <input className={styles.input_text} onChange={rePasswordInput} value={rePasswordValue} type="password" name="repassword" id="repassword" placeholder='retapez votre mot de passe' required />
                    </div>
                    {!loading ?
                        <input className={styles.btnSubmit} type="submit" value="Submit" />
                        :
                        <input className={styles.btnSubmit + ' ' + styles.animValidation} type="submit" value="Submit" />
                    }
                </form>
            </div>
        </div>
    );
}


