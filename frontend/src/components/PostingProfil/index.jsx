import React, { useState, useEffect } from 'react'
import styles from '../../utils/style/components/posting/style.module.css';
import Confirmation from '../Confirmation';
import LikeOrDislike from '../LikeOrDislike';


function Posting({ post, user_profil, socket, PostsUser, setPostUser }) {



    // récupère le token et l'user dans la sessionStorage 
    let token;
    // si une session est déclaré 
    if (sessionStorage.getItem('userSession')) {
        token = JSON.parse(sessionStorage.getItem('userSession')).token;
    }




    // contient la liste des userId des utilisateur qui ont like se post
    const [UsersLiked, setUsersLiked] = useState(JSON.parse(post.usersliked));

    // contient la liste des userId des utilisateur qui ont dislike se post
    const [UsersDisliked, setUsersDisliked] = useState(JSON.parse(post.usersdisliked));

    // affiche la boite de confirmation
    const [confirmBox, setConfirmBox] = useState(false);



    /** status du visuelle des like ou dislike 
     * true = like
     * false = dislike
     * undefined = none
     */
    const [DislikeOrLike, setDislikeOrLike] = useState();

    // vérifié si l'userId de l'utilisateur est présent dans le tableau des like
    if (JSON.parse(post.usersliked).length > 0) {
        // récupère le poste présent et vérifie si il est déclaré 
        if (JSON.parse(post.usersliked).filter((user) => user === user_profil.userId).length > 0) {
            // si DislikeOrLike n'est pas déclaré 
            if (DislikeOrLike !== 'true' && DislikeOrLike !== 'false' && DislikeOrLike !== 'none') {
                // passe le state a true
                setDislikeOrLike('true')
            }

        }
    }
    // vérifié si l'userId de l'utilisateur est présent dans le tableau des dislike
    if (JSON.parse(post.usersdisliked).length > 0) {
        // récupère le poste présent et vérifie si il est déclaré 
        if (JSON.parse(post.usersdisliked).filter((user) => user === user_profil.userId).length > 0) {
            // si DislikeOrLike n'est pas déclaré 
            if (DislikeOrLike !== 'true' && DislikeOrLike !== 'false' && DislikeOrLike !== 'none') {
                // passe le state a false
                setDislikeOrLike('false')
            }

        }
    }


    // gère le système de like 
    useEffect(() => {

        // écoute l'événement like 
        socket.on('like', (like) => {

            // vérifie si l'id du post est égale a l'id du post like
            if (Number(post.id) === Number(JSON.parse(like).id)) {

                // ajoute le tableau des like au state 
                setUsersLiked(JSON.parse(like).usersliked)
                // ajoute le tableau des dislike au state
                setUsersDisliked(JSON.parse(like).usersdisliked)

                // modifie le state le state principal des poste en ajoute le tableau des like 
                PostsUser.filter((user) => user.id === post.id)[0].usersliked = JSON.stringify(JSON.parse(like).usersliked);
                PostsUser.filter((user) => user.id === post.id)[0].usersdisliked = JSON.stringify(JSON.parse(like).usersdisliked);

                // fait remonté l'information
                setPostUser(PostsUser)

            }
        })


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    function verif() {
        // affiche la boite de confirmation
        setConfirmBox(true)
    }

    function deleted() {


        // créer le post a transmettre par le corp de la requête
        let Post = {
            id: String(post.id),
            post: post
        }


        // initialize les options de la requête 
        const options = {
            method: 'POST',
            body: JSON.stringify(Post),
            headers: {
                'Accept': 'application/json',
                "content-type": "application/json",
                'authorization': "Bearer " + token
            },
        };

        fetch("http://localhost:3000/api/post/DeletedPostData", options)

            .then((response) => response.json())
            .then((response) => {
                console.log(response);
                // informe le server du like 
                socket.emit('DeletePost', JSON.stringify(post.id))
                // mets a jour le state des post de l'utilisateur 
                setPostUser(PostsUser.filter((user) => user.userId === user_profil.userId).filter((user) => user.id !== post.id))


            })
    }
    // contient la question a poser a l'utilisateur 
    let question = 'Je suis sûr de vouloir supprimer ce post ?'
    return (
        <>
            {confirmBox &&
                <Confirmation question={question} submit={deleted} setConfirmBox={setConfirmBox} />
            }
            <div className={styles.container_content} >
                {user_profil &&
                    <>
                        <div className={styles.user_profil}>
                            <div className={styles.img_profil}>
                                <img src={'http://localhost:3000/' + user_profil.image} alt="profil" />
                            </div>
                            <div className={styles.user_info}>
                                <p>{user_profil.nom} {user_profil.prenom}</p>
                            </div>
                        </div>


                        <div className={styles.container_post}>
                            <div className={styles.container_post_content}>
                                <img src={'http://localhost:3000/' + post.image} alt='' width='100%' height='100%' />
                                <div className={styles.img_post_content_information}>
                                    <p className={styles.img_info_date}>Posté le {post.date} à {post.heure}</p>

                                    <div className={styles.img_info_description}>
                                        <p>Description :</p>
                                        <p className={styles.description}>{post.description}</p>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.container_button}>
                            <div className={styles.container_btn_delete}>
                                <div className={styles.container_content_btn_delete} onClick={() => verif()}>
                                    <p className={styles.btn_delete} >Supprimer</p>
                                </div>
                            </div>
                            <LikeOrDislike DislikeOrLike={DislikeOrLike} setDislikeOrLike={setDislikeOrLike} styles={styles} UsersLiked={UsersLiked} setUsersLiked={setUsersDisliked} UsersDisliked={UsersDisliked} setUsersDisliked={setUsersDisliked} post={post} token={token} user_profil={user_profil} socket={socket} />
                        </div>
                    </>
                }
            </div>
        </>
    )
};
export default Posting