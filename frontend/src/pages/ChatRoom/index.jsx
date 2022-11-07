import React, { useState } from 'react';
import styles from '../../utils/style/pages/chatRoom/style.module.css';
import { ProfilUtilisateur } from '../ProfilUtilisateur/index.jsx';
import { AddPost } from '../../components/AddPost'
import Posting from '../../components/Posting'




/**
 * affiche les post et les utilisateur connecté 
 * @param {*} userCo contient le tableau des utilisateurs connecté 
 * @param {*} user_profil contient les informations du profil utilisateur 
 * @param {*} postAll contient le tableau de tout les posts 
 * @param {*} AllProfils contient le tableau de tout les Profils 
 */
export const ChatRoom = ({ PostsUser, setPostUser, admin, userCo, user_profil, postAll, setPostAll, AllProfils, socket }) => {


    // passe a true si l'utilisateur clique sur le btn de visualisation de connexion
    const [profilUser, setProfilUser] = useState(false)
    // state btn ajouter un post passe a true quand l'utilisateur clique sur ajouter un post
    const [addPost, setAddPost] = useState(false);

    const [close, setClose] = useState(true)

    /** gère l'animation du système de visualisation de connexion */
    function closeProfilsUsers(e) {

        // si un profil est présent 
        if (profilUser) {
            console.log(e.target.offsetParent.children[0]);

            setClose(true)
            /*  e.target.offsetParent.classList.add(styles.close)
             e.target.offsetParent.children[0].classList.add(styles.close) */
        } else {
            console.log(e.target.offsetParent.children[0]);
            setClose(false)
            /*  e.target.offsetParent.classList.remove(styles.close)
             e.target.offsetParent.children[0].classList.remove(styles.close) */
        }
        setProfilUser(!profilUser)
    }




    return (
        <div className={styles.container}>

            <h2 className={styles.title}>Fil d'actualité</h2>

            {/* système de visualisation de connexion */}
            <div className={!close ? styles.ProfilUtilisateur : `${styles.close} + ${styles.ProfilUtilisateur}`}>

                <ProfilUtilisateur styles={styles} close={close} user_profil={user_profil} userCo={userCo} AllProfils={AllProfils} />

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

            {/* formulaire d'ajout de post */}
            <div className={styles.AddPost} >
                {addPost
                    ? <AddPost setAddPost={setAddPost} />
                    :
                    <div className={styles.container_addPost} onClick={() => setAddPost(!addPost)} >
                        <h3 onClick={() => setAddPost(!addPost)} >+ Ajouter un post</h3>
                    </div>
                }
            </div>
            {/* affiche les post présent */}
            {postAll && postAll.length > 0 ?
                postAll.map((post) =>
                    <Posting key={'post' + Math.random()} admin={admin} PostsUser={PostsUser} setPostUser={setPostUser} socket={socket} user_profil={user_profil} post={post} postAll={postAll} setPostAll={setPostAll} AllProfils={AllProfils} />
                )
                :
                <>
                    <div className={styles.info} >
                        <h1>Soyez le premier à ajouter un post</h1>
                        <p>Vous pouvez ajouter un post en cliquant sur le bouton "ajouter un post" ci-dessus</p>
                    </div>
                </>

            }
        </div>


    );
}

