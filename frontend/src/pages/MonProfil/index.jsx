import React, { useState } from 'react';
import styles from '../../utils/style/pages/chatRoom/style.module.css';
import PostingProfil from '../../components/PostingProfil'
import { AddPost } from '../../components/AddPost';


/**
 * affiche les post de l'utilisateur connecté 
 * @param {*} user_profil contient le profil de l'utilisateur   
 * @param {*} userId contient l'userId de l'utilisateur   
 */
export const MonProfil = ({ user_profil, socket, PostsUser, setPostUser }) => {

    // state btn ajouter un post passe a true quand l'utilisateur clique sur ajouter un post
    const [addPost, setAddPost] = useState(false);




    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Mon profil</h2>
            <div className={styles.flex_reverse}>

                {user_profil && PostsUser.length > 0 ?
                    <>
                        <div className={styles.AddPost} >
                            {addPost
                                ? <AddPost setAddPost={setAddPost} />
                                : <div className={styles.container_addPost} onClick={() => setAddPost(!addPost)} >
                                    <h3 onClick={() => setAddPost(!addPost)} >+ Ajouter un post</h3>
                                </div>
                            }
                        </div>
                        {PostsUser.map((post) =>
                            <PostingProfil key={'post' + Math.random()} socket={socket} user_profil={user_profil} post={post} PostsUser={PostsUser} setPostUser={setPostUser} />
                        )}
                    </>
                    :
                    <>
                        <div className={styles.info} >
                            <h1>Vous n'avez pas encore de post</h1>
                            <p>Vous pouvez ajouter un post en cliquant sur "ajouter un post" dans le fil d'actualité</p>
                            <p>ou remplissez les informations ci-dessous</p>
                        </div>
                        <div className={styles.AddPost} >

                            <AddPost />
                        </div>
                    </>
                }
            </div>
        </div >
    )
}