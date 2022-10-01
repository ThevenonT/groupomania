import React, { useState } from 'react';
import imgDefault from '../../assets/images_profils/profils_default2.png'
import styles from '../../utils/style/chatRoom/style.module.css'
import io from 'socket.io-client';


export const AddPost = ({ setAddPost }) => {


    // contient l'image de prévisualisation renseigné par l'utilisateur 
    const [imagePreview, setImagePreview] = useState('');

    const [descriptionValue, setDescriptionValue] = useState('');
    /** retourne la saisie utilisateur de la description */
    function descriptionVal(e) {
        setDescriptionValue(e.target.value)
        console.log(e.target.value);
    }
    /** ajoute l'image de prévisualisation */
    function uploadImg(e) {
        setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
    /** s'exécute au click de l'utilisateur sur le btn submit  */
    function submit(e) {

        e.preventDefault();
        // récupère la date du jour en français 
        let option = { weekday: "long", year: "numeric", month: "long", day: "2-digit" };
        console.log(new Date().toLocaleDateString("fr-FR", option));
        // récupère la date du jour 
        let date = ('0' + new Date().getDate()).slice(-2) + "/" + ('0' + (new Date().getMonth() + 1)).slice(-2) + "/" + new Date().getFullYear();
        // récupère l'heure actuel
        let heure = new Date().getHours() + 'h' + new Date().getMinutes()

        console.log(e.target[0].files[0]);

        // initialization et configuration des options du corps de la requête 
        const formData = new FormData();

        // initialization de l'image
        formData.append('image', e.target[0].files[0]);
        // initialization de la date
        formData.append('date', date);
        // initialization de l'heure
        formData.append('heure', heure);
        // initialization de la description
        formData.append('description', descriptionValue);


        // options de requête 
        const options = {
            method: 'POST',
            body: formData,
            headers: {
                "Accept": "application/json",
                'authorization': "Bearer " + JSON.parse(sessionStorage.getItem('userSession')).token
            },
        };

        // requête l'api pour enregistré les data du profil
        fetch('http://localhost:3000/api/post/addPostData', options)
            .then((response) => response.json())
            .then((response) => {
                console.log(response);

                if (response.status === 200) {

                    let Post = {
                        id: response.id,
                        userId: response.userId,
                        date: date,
                        heure: heure,
                        image: response.img,
                        description: descriptionValue,
                        usersliked: '[]',
                        usersdisliked: '[]'
                    }

                    const socket = io.connect('http://localhost:3000');
                    // informe le server de la connexion 
                    socket.emit('AddPost', JSON.stringify(Post))
                    setAddPost(false)
                }
                else {
                    console.log(response);
                }

            }).catch((err) => {
                console.log(err);
            })

    }
    return (
        <>
            <form onSubmit={(e) => submit(e)} className={styles.form_AddPost}>
                <p onClick={() => setAddPost(false)} className={styles.btn_close}>annuler</p>
                <div className={styles.form_AddPost_addImg}>
                    <label className={styles.form_AddPost_imgPreview} htmlFor='image' placeholder='ajouter une image'>
                        <img src={imagePreview ? imagePreview : imgDefault} alt='img' width="auto" height="100px" />
                    </label>
                    <input className={styles.form_AddPost_input} type="file" name="image" id='image' onChange={(e) => uploadImg(e)} accept=".png, .jpg, .jpeg" />
                </div>
                <textarea onChange={(e) => descriptionVal(e)} className={styles.form_AddPost_textarea} type="text" name='description' placeholder='ajouté une description' />
                <input className={styles.form_btn} type="submit" value='Ajouté le post' />
            </form>
        </>
    )
}