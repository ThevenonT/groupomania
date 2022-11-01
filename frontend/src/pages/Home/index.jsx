import React, { useState } from 'react';
import { Header } from '../../components/Header';
import { Login } from '../Login';
import { Signup } from '../Signup';

import { useVerifToken } from '../../utils/hooks/token';

import Navigation from '../Navigation';


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
    // eslint-disable-next-line no-unused-vars
    const { validToken, loader, Admin } = useVerifToken(token);


    return (
        <>
            <Header validToken={validToken} setSignupState={setSignupState} SignupState={SignupState} navigation={navigation} setNavigation={setNavigation} />
            {!validToken ?
                SignupState ?
                    <Signup setErrorLogin={setErrorLogin} setSignupState={setSignupState} SignupState={SignupState} />
                    :
                    <Login setErrorLogin={setErrorLogin} ErrorLogin={ErrorLogin} />
                :
                <Navigation validToken={validToken} navigation={navigation} Admin={Admin} />
            }

        </>
    )
}
export default Home;