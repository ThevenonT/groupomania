import React, { useState } from 'react';
import styles from '../../utils/style/chatRoom/style.module.css';
import { ProfilUtilisateur } from '../ProfilUtilisateur/index.jsx';


/**
 * affiche les post et les utilisateur connecté 
 * @param {*} userCo contient le tableau des utilisateurs connecté 
 * @param {*} user_profil contient les informations du profil utilisateur 
 * @param {*} AllPost contient le tableau de tout les posts 
 * @param {*} AllProfils contient le tableau de tout les Profils 
 */
export const ChatRoom = ({ userCo, user_profil, AllProfils }) => {



    // passe a true si l'utilisateur clique sur le btn de visualisation de connexion
    const [profilUser, setProfilUser] = useState(false)

    /** gère l'animation du système de visualisation de connexion */
    function closeProfilsUsers(e) {


        if (profilUser) {
            e.target.offsetParent.classList.add(styles.close)
            e.target.offsetParent.children[0].classList.add(styles.close)
        } else {
            e.target.offsetParent.classList.remove(styles.close)
            e.target.offsetParent.children[0].classList.remove(styles.close)
        }
        setProfilUser(!profilUser)
    }




    return (
        <div className={styles.container}>

            <h2 className={styles.title}>fil d'actualité</h2>
            {/* système de visualisation de connexion */}
            <div className={`${styles.ProfilUtilisateur} + ${styles.close}`}>

                <ProfilUtilisateur user_profil={user_profil} userCo={userCo} AllProfils={AllProfils} />

                {profilUser ?
                    <span onClick={(e) => closeProfilsUsers(e)} className={styles.croix}></span>
                    :
                    <div className={styles.userprofil} >
                        <span className={styles.Co}></span>
                        <span onClick={(e) => closeProfilsUsers(e)} className={styles.icone}>
                            <img className={styles.imgProfil} width='60px' src={'http://localhost:3000/' + user_profil.image} alt='' />
                        </span>
                    </div>
                }
            </div>
        </div>


    );
}
