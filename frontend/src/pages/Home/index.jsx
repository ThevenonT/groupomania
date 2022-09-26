import React, { useState, useEffect } from 'react';
import { Header } from '../../components/Header';
import { Login } from '../Login';
import { Signup } from '../Signup';
import { ProfilsConfig } from '../../pages/ProfilsConfig';
import { ChatRoom } from '../../pages/ChatRoom';

import { useVerifToken } from '../../utils/hooks/token';
import { useFetch } from '../../utils/hooks/fetch.jsx';
import { useFetchAllProfils } from '../../utils/hooks/FetchAllProfils';

import io from 'socket.io-client';


/** Contient la page d'accueil et gère la redirection */
const Home = () => {

    // passe a true si l'utilisateur clique sur le btn créer un compte 
    const [SignupState, setSignupState] = useState(false);

    // contient une erreur si celle-ci se produit lors de la connexion 
    const [ErrorLogin, setErrorLogin] = useState('');

    // gère la redirection
    const [navigation, setNavigation] = useState('actualité');

    // contient la liste des utilisateur connecter 
    const [userCo, setUserCo] = useState([]);

    // state de connexion 
    const [Co, setCo] = useState(false);

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


    // récupère tous les utilisateurs présents
    // récupère tous les posts présents 
    const { AllProfils } = useFetchAllProfils('http://localhost:3000/api/profil/getAllProfils')


    // gère le système de connexion 
    useEffect(() => {

        // se connecte au socket du server 
        const socket = io.connect('http://localhost:3000');

        // si un profil utilisateur est présent
        // si le token est valide 
        // si l'utilisateur n'est pas déjà connecté 
        if (user_profil && validToken && !Co) {

            console.log('effect');
            console.log(user_profil.userId);
            // inform le server de la connexion 
            socket.emit('connexion', user_profil.userId)


            // si un client est connecté 
            // ou si le client se déconnecte 
            socket.on('userCo', (userCo) => {
                // log le tableau de utilisateur connecté 
                console.log('connect', userCo);
                console.log(userCo.length);
                // ajoute le tableau dans le state 
                setUserCo(userCo);
                // passe le state de connexion socket a true 
                return setCo(true)
            });



        }






    }, [user_profil, validToken, Co])

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
                        <ChatRoom AllProfils={AllProfils} user_profil={user_profil} userCo={userCo} />
                        : navigation === 'compte' ?
                            <h1>mon compte</h1>
                            : navigation === 'profil' &&
                            <h1>mon profil</h1>
            }

        </>
    )
}
export default Home;