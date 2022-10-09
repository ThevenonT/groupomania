import { useState, useEffect } from 'react'

/**
 * requête l'api pour vérifié le token fournit 
 * @param {String} token contient le token récupéré depuis le sessionStorage
 * @returns validToken // passe a true si le token est valide 
 */
export function useVerifToken(token) {

    // passe a true si le token est validé 
    const [validToken, setValidToken] = useState(false);
    // passe a true si un chargement est nécessaire
    const [loader, setLoader] = useState(true);

    // passe a true si l'utilisateur se connecte avec le compte administrateur 
    const [Admin, setAdmin] = useState(false)

    // se déclenche un fois au changement de token 
    useEffect(() => {
        // si aucun token n'est présent 
        if (!token) {
            // arrête le chargement 
            setLoader(false);
            // retourne le state de token valide à false 
            return setValidToken(false);
        }
        /**
         * requête l'api pour vérifié le token présent */
        async function verifToken() {

            if (validToken === false && token !== undefined) {

                // initialize les options et ajoute le body de la requête 
                const options = {
                    method: 'POST',
                    body: JSON.stringify({ token: token }),
                    headers: {
                        'Accept': 'application/json',
                        "content-type": "application/json"
                    },

                };

                // requête l'api pour vérifié le token présent 
                const response = await fetch("http://localhost:3000/api/auth/token", options)

                // parse le résultat au format json
                const data = await response.json()
                // si le status est a 200
                if (data.status === 200) {
                    if (data.admin) {
                        setAdmin(true)
                    }
                    // valide le token 
                    setValidToken(true);
                    // ou si le status est a 401 
                } else if (data.status === 401) {
                    // ne valide pas le token 
                    setValidToken(false);
                    console.log(data);
                }
                // arrête le chargement 
                setLoader(false);

            }
        }
        // appelle de la function 
        verifToken()

    }, [token, validToken])

    return { validToken, loader, Admin }
}