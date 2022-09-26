import { useState, useEffect } from 'react'

/** si l'id de l'utilisateur est fournit il sera ajouté dans le corp de la requête 
 * @param {*} url 
 * 'http://localhost:3000/api/post/getAllData' => `SELECT * FROM post ORDER BY id DESC`
 * 'http://localhost:3000/api/profil/getOneData' => `SELECT * FROM profils WHERE userId LIKE '${req.body.userId}'`
 * @param {*} userId 
 */
export function useFetch(url) {



    let token;

    if (sessionStorage.getItem('userSession')) {
        token = JSON.parse(sessionStorage.getItem('userSession')).token;
    }


    // initialize les options de la requête 
    const options = {
        method: 'GET',
        headers: {
            "Accept": "application/json",
            "content-type": "application/json",
            "authorization": "Bearer " + token
        },

    };


    /** contient la response du server */
    const [data, setData] = useState()
    /** State de chargement  */
    const [isLoading, setLoading] = useState(true)
    /** State d'erreur */
    const [error, setError] = useState(false)

    useEffect(() => {

        /** contient la réponse du serveur */
        fetch(url, options)
            .then((response) => response.json())
            .then((res) => {
                console.log(res);
                if (res.status === 200) {
                    /** ajoute la réponse au format json dans le state data */
                    setData(res.response)
                } else {
                    setData(false)
                }
            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return { isLoading, data, error }
}

