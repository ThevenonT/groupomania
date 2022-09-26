import React, { useState, useEffect } from 'react';
import { Header } from '../../components/Header';
import { Login } from '../Login';
import { Signup } from '../Signup';
import { useVerifToken } from '../../utils/hooks/token';
import { ProfilsConfig } from '../../pages/ProfilsConfig';
import { useFetch } from '../../utils/hooks/fetch.jsx';


/** Contient la page d'accueil et gère la redirection */
const Home = () => {

    // passe a true si l'utilisateur clique sur le btn créer un compte 
    const [SignupState, setSignupState] = useState(false);

    // contient une erreur si celle-ci se produit lors de la connexion 
    const [ErrorLogin, setErrorLogin] = useState('');

    // gère la redirection
    const [navigation, setNavigation] = useState('actualité');


    /** Contient le token de l'utilisateur */
    let token;

    // si la session n'est pas null
    if (sessionStorage.getItem('userSession') !== null && !token) {
        // récupération du token 
        token = JSON.parse(sessionStorage.getItem('userSession')).token;
    }


    // vérifie le token 
    const { validToken, loader } = useVerifToken(token);


    // contient le profil utilisateur 
    const [user_profil, setUser_profil] = useState();
    // récupère le profil utilisateur 
    const { data } = useFetch('http://localhost:3000/api/profil/getOneData');
    // si un profil est récupéré et qu'aucun profil n'est present 
    if (data && !user_profil) {
        console.log('userProfil', data);
        // ajoute les information du profil dans le state 
        setUser_profil(data[0]);
    }


    return (
        <>
            <Header validToken={validToken} setSignupState={setSignupState} SignupState={SignupState} navigation={navigation} setNavigation={setNavigation} />
            {!validToken ?
                SignupState ?
                    <Signup setErrorLogin={setErrorLogin} setSignupState={setSignupState} SignupState={SignupState} />
                    :
                    <Login setErrorLogin={setErrorLogin} ErrorLogin={ErrorLogin} />
                :
                !user_profil ?
                    <ProfilsConfig />
                    :
                    navigation === 'actualité' ?
                        <h1>ChatRoom</h1>
                        : navigation === 'compte' ?
                            <h1>mon compte</h1>
                            : navigation === 'profil' &&
                            <h1>mon profil</h1>
            }

        </>
    )
}
export default Home;