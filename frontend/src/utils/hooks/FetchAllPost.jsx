/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'

/**
 * récupère tout les post présent 
 * @param {*} url requête sql
 */
export function useFetchAllPost(url) {


    /** contient la response du server */
    const [AllPost, setAllPost] = useState(null)
    /** State de chargement  */
    const [isLoading, setLoading] = useState(true)
    /** State d'erreur */
    const [error, setError] = useState(false)

    let token
    if (sessionStorage.getItem('userSession')) {
        token = JSON.parse(sessionStorage.getItem('userSession')).token
    }

    // initialize les options de la requête 
    const options = {
        method: 'POST',
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
                setAllPost(res.response);

            })

    }, [])

    return { isLoading, AllPost, error }

}
