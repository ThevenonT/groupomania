import React from 'react';
import styles from '../../utils/style/chatRoom/style.module.css';
import PostingProfil from '../../components/PostingProfil'


/**
 * affiche les post de l'utilisateur connecté 
 * @param {*} user_profil contient le profil de l'utilisateur   
 * @param {*} userId contient l'userId de l'utilisateur   
 */
export const MonProfil = ({ user_profil, socket, PostsUser, setPostUser }) => {





    return (
        <div className={styles.container}>
            <h2 className={styles.title}>mon profil</h2>
            <div className={styles.flex_reverse}>
                {user_profil && PostsUser &&

                    PostsUser &&
                    PostsUser.map((post) =>
                        <PostingProfil key={'post' + Math.random()} socket={socket} user_profil={user_profil} post={post} PostsUser={PostsUser} setPostUser={setPostUser} />
                    )
                }
            </div>
        </div >
    )
}