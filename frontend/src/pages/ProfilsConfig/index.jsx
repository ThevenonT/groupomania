import React, { useState } from 'react'
import imgDefault from '../../assets/images_profils/profils_default2.png'
import styles from '../../utils/style/connexion/style.module.css'
/**
 * affiche un formulaire pour la création du profil utilisateur */
export function ProfilsConfig() {

    // contient le nom renseigné par l'utilisateur 
    const [nomValue, setNomValue] = useState('');
    // contient le prenom renseigné par l'utilisateur 
    const [prenomValue, setPrenomValue] = useState('');
    // contient la description renseigné par l'utilisateur 
    const [descriptionValue, setDescriptionValue] = useState('');
    // contient l'image de prévisualisation renseigné par l'utilisateur 
    const [imagePreview, setImagePreview] = useState('');

    /** retourne la saisie utilisateur du nom */
    function nomVal(e) {
        setNomValue(e.target.value)
        console.log(e.target.value);
    }
    /** retourne la saisie utilisateur du prénom */
    function prenomVal(e) {
        setPrenomValue(e.target.value)
        console.log(e.target.value);
    }
    /** retourne la saisie utilisateur de la description */
    function descriptionVal(e) {
        setDescriptionValue(e.target.value)
        console.log(e.target.value);
    }
    /** ajoute l'image de prévisualisation */
    function uploadImg(e) {
        setImagePreview(URL.createObjectURL(e.target.files[0]));
    }


    function submit(e) {
        // retire les évènement par default
        e.preventDefault();

        // initialization et configuration des options du corps de la requête 
        const formData = new FormData();
        // initialization de l'image
        formData.append('image', e.target[3].files[0]);
        // initialization du nom
        formData.append('nom', nomValue);
        // initialization du prenom
        formData.append('prenom', prenomValue);
        // initialization de la description
        formData.append('description', descriptionValue);
        // initialization de l'userId
        formData.append('userId', JSON.parse(sessionStorage.getItem('userSession')).userId);

        let token
        if (sessionStorage.getItem('userSession')) {
            token = JSON.parse(sessionStorage.getItem('userSession')).token
        }

        // options de requête 
        const options = {
            method: 'POST',
            body: formData,
            headers: {
                "Accept": "application/json",
                'authorization': "Bearer " + token
            },
        };
        // requête l'api pour enregistré les data du profil
        fetch('http://localhost:3000/api/profil/addProfilsData', options)
            .then((response) => response.json())
            .then((response) => {
                console.log(response);

                // recharge la page 
                window.location.reload();
            }).catch((err) => {
                console.log(err);
            })

    }


    return (
        <div className={styles.container}>
            <div className={styles.container_content}>
                <h2 className={styles.title}>Configurations du profils</h2>
                <form className={styles.form} onSubmit={(e) => submit(e)} encType='multipart/form-data'>
                    <div className={styles.input_text}>
                        <input type="text" onChange={(e) => nomVal(e)} placeholder="Nom" />
                        <input type="text" onChange={(e) => prenomVal(e)} placeholder="Prénom" />
                        <input type="text" onChange={(e) => descriptionVal(e)} placeholder="description" />
                        <div className={styles.container_img}>
                            <div className={styles.container_img_content}>
                                <img className={styles.preview} src={imagePreview ? imagePreview : imgDefault} alt='img' width="auto" height="100px" />
                            </div>
                            <input className={styles.input_file} type="file" name="image" onChange={(e) => uploadImg(e)} accept=".png, .jpg, .jpeg" />
                        </div>
                    </div>
                    <input className={styles.btnSubmit} type="submit" value="Submit" />
                </form>
            </div>
        </div>
    )
}
