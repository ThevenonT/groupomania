/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'

/**
 * récupère tout les post présent 
 * @param {*} url requête sql 
 * @param {*} userId userId de l'utilisateur 
 */
export function useFetchAllPostOneUser(url) {



    /** contient la response du server */
    const [UserPosts, setUserPosts] = useState(null)
    /** State de chargement  */
    // eslint-disable-next-line no-unused-vars
    const [isLoading, setLoading] = useState(true)
    /** State d'erreur */
    // eslint-disable-next-line no-unused-vars
    const [error, setError] = useState(false)
    // crée un objet json nommé user 

    let token
    if (sessionStorage.getItem('userSession')) {
        token = JSON.parse(sessionStorage.getItem('userSession')).token
    }
    // initialize les options de la requête 
    const options = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            "content-type": "application/json",
            'authorization': "Bearer " + token
        },

    };





    useEffect(() => {

        /** contient la réponse du serveur */
        fetch(url, options)
            .then((response) => response.json())
            .then((res) => {

                /** ajoute la réponse au format json dans le state data */
                setUserPosts(res.response);

            })

    }, [url])

    return { isLoading, UserPosts, error }

}
