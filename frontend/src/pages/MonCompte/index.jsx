import React, { useState } from 'react';
import Confirmation from '../../components/Confirmation';
import styles from '../../utils/style/pages/connexion/style.module.css'

function MonCompte({ user_profil, AllProfils, admin }) {


    // contient le nom renseigné par l'utilisateur 
    const [nomValue, setNomValue] = useState(user_profil.nom);
    // contient le prenom renseigné par l'utilisateur 
    const [prenomValue, setPrenomValue] = useState(user_profil.prenom);
    // contient la description renseigné par l'utilisateur 
    const [descriptionValue, setDescriptionValue] = useState(user_profil.description);
    // contient l'image de prévisualisation renseigné par l'utilisateur 
    const [imagePreview, setImagePreview] = useState();

    // contient le texte de l'erreur 
    const [Error, setError] = useState('');

    // affiche la boite de confirmation pour la modification du profil
    const [confirmBoxModif, setConfirmBoxModif] = useState(false);
    // affiche la boite de confirmation pour la suppression du profil et du compte 
    const [confirmBoxDeleted, setConfirmBoxDeleted] = useState(false);
    // affiche la boite de confirmation pour la suppression du profil et du compte 
    const [confirmBoxDeletedAdmin, setConfirmBoxDeletedAdmin] = useState(false);
    // contient l'event pour la modification 
    const [e, setE] = useState();
    // contient la question a poser a l'utilisateur  
    const [question, setQuestion] = useState();
    // contient le message important a transmettre a l'utilisateur 
    const [MsgImportant, setMsgImportant] = useState();


    // récupère le token 
    let token
    if (sessionStorage.getItem('userSession')) {
        token = JSON.parse(sessionStorage.getItem('userSession')).token
    }


    /** retourne la saisie utilisateur du nom */
    function nomVal(e) {
        // ajoute le nom saisie par l'utilisateur 
        setNomValue(String(e.target.value).toUpperCase());
    }
    /** retourne la saisie utilisateur du prénom */
    function prenomVal(e) {
        // ajoute le prénom saisie par l'utilisateur 
        setPrenomValue(String(e.target.value))
    }
    /** retourne la saisie utilisateur de la description */
    function descriptionVal(e) {
        // ajoute la description saisie par l'utilisateur 
        setDescriptionValue(e.target.value)
    }
    /** ajoute l'image de prévisualisation */
    function uploadImg(e) {
        // ajoute l'image ajouter par l'utilisateur 
        setImagePreview(URL.createObjectURL(e.target.files[0]));
    }



    // gère la boite de confirmation pour la modification
    function Verif(event) {
        // retire les évènement par default
        event.preventDefault();
        // vérifie si il s'agit du compte administrateur 
        if (user_profil.id === 1) {
            setQuestion('');
            setMsgImportant('impossible de modifier le profil administrateur !')
        } else {
            setMsgImportant('Votre compte sera modifier !')
            // initialisation de la question a poser a l'utilisateur 
            setQuestion('Je suis sûr de vouloir modifier mon profil ? ');
        }
        // ajoute l'évènement au state 
        setE(event)
        // affiche l'alert
        setConfirmBoxModif(true)

    }

    // s'exécute a la validation de la boite de confirmation: modifie le profil
    function submit(e) {


        // vérifie si le nom est déclaré
        if (nomValue.length > 0) {
            // vérifie si le prénom est déclaré
            if (prenomValue.length > 0) {
                // vérifie si la description est déclaré 
                if (descriptionValue.length > 0) {

                    // initialization et configuration des options du corps de la requête 
                    const formData = new FormData();
                    // initialize l'image 
                    formData.append('image', e.target[3].files[0]);
                    // retourne le nom de l'image déjà enregistré
                    formData.append('imageUrl', user_profil.image);
                    // initialization du nom
                    formData.append('nom', nomValue);
                    // initialization du prenom
                    formData.append('prenom', prenomValue);
                    // initialization de la description
                    formData.append('description', descriptionValue);
                    // récupère l'id de l'utilisateur 
                    formData.append('id', user_profil.id);

                    // récupère le token
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
                    fetch('http://localhost:3000/api/profil/modifyProfilsData', options)
                        .then((response) => response.json())
                        .then((response) => {
                            console.log(response);
                            if (response.status === 200) {
                                // recharge la page 
                                window.location.reload();

                            }
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



    // gère la boite de confirmation pour la suppression 
    function VerifDeleted() {
        if (user_profil.id === 1) {
            setQuestion('');
            setMsgImportant('impossible de supprimé le compte administrateur !')
        } else {
            setMsgImportant('Votre compte sera supprimé !')
            // initialisation de la question a poser a l'utilisateur 
            setQuestion('Je suis sûr de vouloir supprimer mon compte, ainsi que toutes les informations relatives à ce compte ?');
        }
        // affiche l'alert
        setConfirmBoxDeleted(true)

    }

    // supprime toute les informations relatif à l'utilisateur 
    function deleted() {
        console.log('deleted');

        // crée un objet json nommé user 
        let user = {
            user_profil: user_profil
        };
        // initialize les options et ajoute le body de la requête 
        const options = {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Accept': 'application/json',
                "content-type": "application/json",
                'authorization': "Bearer " + token

            },

        };
        // connecte l'utilisateur 
        // requête l'api pour vérifié l'authenticité de l'email et du mot de passe fournie par l'utilisateur 
        fetch("http://localhost:3000/api/profil/deleted", options)

            .then((response) => response.json())
            .then((response) => {
                console.log(response);
                if (response.status === 200) {
                    sessionStorage.removeItem('userSession')
                    window.location.reload();
                }

            })

    }


    // contient le profil a supprimé ( demande administrateur )
    const [profil, setProfil] = useState()
    // gère la boite de confirmation pour la suppression Admin
    function VerifProfilSup(profil) {

        setProfil(profil)
        // initialisation de la question a poser a l'utilisateur 
        setQuestion('Je suis sûr de vouloir supprimer ce compte, ainsi que toutes les informations relatives à ce compte ?');
        // affiche l'alert
        setConfirmBoxDeletedAdmin(true)

    }
    // function admin : supprime l'utilisateur sélectionné ainsi que toute ses informations
    function ProfilSup(profil) {
        console.log(profil);
        // crée un objet json nommé user 
        let user = {
            user_profil: profil
        };
        // initialize les options et ajoute le body de la requête 
        const options = {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Accept': 'application/json',
                "content-type": "application/json",
                'authorization': "Bearer " + token

            },

        };
        // connecte l'utilisateur 
        // requête l'api pour vérifié l'authenticité de l'email et du mot de passe fournie par l'utilisateur 
        fetch("http://localhost:3000/api/profil/deleted", options)

            .then((response) => response.json())
            .then((response) => {
                console.log(response);
                if (response.status === 200) {

                    window.location.reload();
                }

            })

    }

    return (
        <div className={styles.container}>
            {confirmBoxModif &&
                <Confirmation submit={submit} event={e} setConfirmBox={setConfirmBoxModif} question={question} MsgImportant={MsgImportant} />
            }
            {confirmBoxDeleted &&
                <Confirmation submit={deleted} event={e} setConfirmBox={setConfirmBoxDeleted} question={question} MsgImportant={MsgImportant} />
            }
            {confirmBoxDeletedAdmin &&
                <Confirmation submit={ProfilSup} event={profil} setConfirmBox={setConfirmBoxDeletedAdmin} question={question} MsgImportant={'le compte sera supprimé !'} />
            }
            <div className={styles.container_content}>
                <span className={styles.croix} onClick={() => VerifDeleted()}></span>
                <h2 className={styles.title}>Modification du profil</h2>
                <form className={styles.form} onSubmit={(e) => Verif(e)} encType='multipart/form-data'>
                    <div className={styles.container_input_text}>
                        <input className={styles.input_text} type="text" onChange={(e) => nomVal(e)} placeholder={user_profil && user_profil.nom} />
                        <input className={styles.input_text} type="text" onChange={(e) => prenomVal(e)} placeholder={user_profil && user_profil.prenom} />
                        <input className={styles.input_text} type="text" onChange={(e) => descriptionVal(e)} placeholder={user_profil && user_profil.description} />
                        <div className={styles.container_img}>
                            <p className={styles.img_info}>Modifier votre photo de profil</p>
                            <label className={styles.form_AddPost_imgPreview} htmlFor='image' placeholder='ajouter une image'>
                                <img className={styles.preview} src={imagePreview ? imagePreview : 'http://localhost:3000/' + user_profil.image} alt='img' width="auto" height="100px" />
                            </label>
                            <input className={styles.fileLook} type="file" name="image" id='image' onChange={(e) => uploadImg(e)} accept=".png, .jpg, .jpeg" />
                        </div>
                        <p className={styles.Error}>{Error}</p>
                    </div>
                    <input className={styles.btnSubmit} type="submit" value="Modifier" />
                </form>
            </div>
            {admin &&
                <div className={styles.container_AllProfils}>
                    <h3 className={styles.subtitle}>Profils présent</h3>
                    {AllProfils.map((profil) =>
                        <div key={profil.id} className={styles.userprofil} >
                            <span className={styles.sup} onClick={() => VerifProfilSup(profil)}></span>

                            <span className={styles.icone}>
                                <img className={styles.imgProfil} width='60px' src={'http://localhost:3000/' + profil.image} alt='' />
                            </span>
                            <p className={styles.info}>{profil.nom}</p>
                            <p className={styles.info}>{profil.prenom}</p>
                        </div>
                    )}
                </div>
            }

        </div>
    )
}

export default MonCompte