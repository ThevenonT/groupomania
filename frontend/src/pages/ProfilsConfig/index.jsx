import React, { useState } from 'react'
import imgDefault from '../../assets/images_profils/profils_default2.png'
import styles from '../../utils/style/connexion/style.module.css'
/**
 * affiche un formulaire pour la création du profil utilisateur */
export function ProfilsConfig() {

    // contient le nom renseigné par l'utilisateur 
    const [nomValue, setNomValue] = useState("");
    // contient le prenom renseigné par l'utilisateur 
    const [prenomValue, setPrenomValue] = useState("");
    // contient la description renseigné par l'utilisateur 
    const [descriptionValue, setDescriptionValue] = useState("");
    // contient l'image de prévisualisation renseigné par l'utilisateur 
    const [imagePreview, setImagePreview] = useState("");

    // contient le texte de l'erreur 
    const [Error, setError] = useState('');


    /** retourne la saisie utilisateur du nom */
    function nomVal(e) {
        setNomValue(String(e.target.value).toUpperCase());
    }
    /** retourne la saisie utilisateur du prénom */
    function prenomVal(e) {
        setPrenomValue(String(e.target.value))
        console.log(String(e.target.value));
    }
    /** retourne la saisie utilisateur de la description */
    function descriptionVal(e) {
        setDescriptionValue(e.target.value)
        console.log((e.target.value));
    }
    /** ajoute l'image de prévisualisation */
    function uploadImg(e) {
        setImagePreview(URL.createObjectURL(e.target.files[0]));
    }


    function submit(e) {
        // retire les évènement par default
        e.preventDefault();
        console.log('nom', nomValue);
        console.log('nom.length', nomValue.length);
        console.log(imagePreview);
        console.log(e);

        let blob = new Blob([imgDefault]);
        console.log(URL.createObjectURL(blob));
        console.log(e.target[3].files[0]);

        if (nomValue.length > 0) {
            if (prenomValue.length > 0) {
                if (descriptionValue.length > 0) {

                    // initialization et configuration des options du corps de la requête 
                    const formData = new FormData();
                    // initialize l'image 
                    formData.append('image', e.target[3].files[0]);
                    // initialization du nom
                    formData.append('nom', nomValue);
                    // initialization du prenom
                    formData.append('prenom', prenomValue);
                    // initialization de la description
                    formData.append('description', descriptionValue);

                    console.log(formData);
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
                } else {
                    setError("Merci de remplir une description !")
                }

            } else {
                setError("Merci de remplir votre prenom !")
            }

        } else {
            setError("Merci de remplir votre nom !")
        }
        setError()
    }


    return (
        <div className={styles.container}>
            <div className={styles.container_content}>
                <h2 className={styles.title}>Configurations du profils</h2>
                <form className={styles.form} onSubmit={(e) => submit(e)} encType='multipart/form-data'>
                    <div className={styles.container_input_text}>
                        <input className={styles.input_text} type="text" onChange={(e) => nomVal(e)} placeholder="Nom" />
                        <input className={styles.input_text} type="text" onChange={(e) => prenomVal(e)} placeholder="Prénom" />
                        <input className={styles.input_text} type="text" onChange={(e) => descriptionVal(e)} placeholder="description" />
                        <div className={styles.container_img}>
                            <p className={styles.img_info}>ajouté une photo de profil</p>
                            <label className={styles.form_AddPost_imgPreview} htmlFor='image' placeholder='ajouter une image'>
                                <img className={styles.preview} src={imagePreview ? imagePreview : imgDefault} alt='img' width="auto" height="100px" />
                            </label>
                            <input className={styles.fileLook} type="file" name="image" id='image' onChange={(e) => uploadImg(e)} accept=".png, .jpg, .jpeg" />
                        </div>
                        <p className={styles.Error}>{Error}</p>
                    </div>
                    <input className={styles.btnSubmit} type="submit" value="Submit" />
                </form>
            </div>
        </div>
    )
}
