import React from 'react';
import styles from '../../utils/style/components/likeordislike/style.module.css'


function LikeOrDislike({ DislikeOrLike, setDislikeOrLike, UsersLiked, setUsersLiked, UsersDisliked, setUsersDisliked, post, token, user_profil, socket }) {


    // gère le système de like
    function like() {

        // créer le post a transmettre par le corp de la requête
        let Post = {
            id: String(post.id),
            like: 1,
            usersliked: UsersLiked,
            usersdisliked: UsersDisliked
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

        fetch("http://localhost:3000/api/post/likes", options)

            .then((response) => response.json())
            .then((response) => {

                // informe le server du like 
                socket.emit('addlike', JSON.stringify(response))
                // mets a jours le state
                setDislikeOrLike(response.like)


            })
    }
    // gère le système de dislike
    function dislike() {


        // créer le post a transmettre par le corp de la requête
        let Post = {
            id: String(post.id),
            like: -1,
            usersliked: UsersLiked,
            usersdisliked: UsersDisliked
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

        fetch("http://localhost:3000/api/post/likes", options)

            .then((response) => response.json())
            .then((response) => {

                // mets a jours le state UsersLiked
                setUsersLiked(response.usersliked)
                // mets a jours le state UsersDisliked
                setUsersDisliked(response.usersdisliked)

                // m'est a jour le status visuelle des like ou dislike 
                setDislikeOrLike(response.like)

                // informe le server du like 
                socket.emit('addlike', JSON.stringify(response))


            })
    }

    return (
        <div className={styles.container_like}>
            <p className={DislikeOrLike === 'true' ? styles.likeActive : styles.like} onClick={() => like()}>👍🏼</p>
            <p className={styles.NbLike}>{!UsersLiked ? JSON.parse(post.usersliked).length : UsersLiked.length}</p>
            <p className={DislikeOrLike === 'false' ? styles.dislikeActive : styles.dislike} onClick={() => dislike()}>👎🏼</p>
            <p className={styles.NbDislike}>{UsersDisliked ? UsersDisliked.length : 0}</p>
        </div>
    )
}

export default LikeOrDislike