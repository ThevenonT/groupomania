import React, { useState } from 'react';
import styles from '../../utils/style/components/header/style.module.css';
import logo from '../../assets/logo.png';


/**
 * gère le système de navigation
 * @param {*} validToken true si le token est valide
 * @param {*} SignupState true si l'utilisateur clique sur le btn créer un compte
 * @param {*} navigation contient le nom de la page a affiché  
 */
export const Header = ({ validToken, SignupState, setSignupState, navigation, setNavigation }) => {
    const [Btn_click, setBtn_click] = useState(false);

    // au click sur fil d'actualité 
    function actualite() {
        // si navigation n'est pas égale a actualité 
        if (navigation !== 'actualité') {
            // mais a jour le state 
            setNavigation('actualité');
        } else {
            return
        }
    }

    // au click sur mon profil 
    function profil() {
        // si navigation n'est pas égale a profil 
        if (navigation !== 'profil') {
            // mais a jour le state 
            setNavigation('profil');
        } else {
            return
        }
    }

    // au click sur mon compte 
    function compte() {
        // si navigation n'est pas égale a profil 
        if (navigation !== 'compte') {
            // mais a jour le state 
            setNavigation('compte');
        } else {
            return
        }
    }

    return (
        <>
            <nav className={styles.nav}>
                <div className={styles.container_nav}>
                    <div className={styles.container_Btn_Menu}>
                        <div onClick={() => { setBtn_click(!Btn_click) }} className={styles.container_Btn_Menu_content}>
                            {validToken && !Btn_click ?
                                <p className={styles.Btn_Menu}></p>
                                : validToken &&
                                <p className={styles.Btn} ></p>
                            }
                        </div>
                    </div>
                    <img className={styles.logo} alt='logo' src={logo} />
                    <div className={styles.container_Btn_Nav}>
                        {!validToken ?
                            <>
                                {!SignupState ?
                                    <p className={styles.BtnNav} onClick={() => { setSignupState(true) }}>Créer Un Compte</p>
                                    :
                                    <p className={styles.BtnNav} onClick={() => { setSignupState(false) }}>Se Connecter</p>
                                }
                            </>
                            :
                            <>
                                {
                                    <p className={styles.BtnNav} onClick={() => { sessionStorage.clear('userSession'); window.location.reload(); }}>Se Déconnecter</p>
                                }
                            </>
                        }
                    </div>
                </div>
            </nav>
            {validToken && Btn_click &&
                <div className={styles.container_menu}>
                    <p onClick={() => { actualite() }} className={navigation === 'actualité' ? 'active' : ''}>fil d'actualité</p>
                    <p onClick={() => { profil() }}>profils</p>
                    <p onClick={() => { compte() }}>Mon Compte</p>
                </div>
            }
        </>
    );
}


