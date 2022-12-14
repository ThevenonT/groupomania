import React, { useState, useEffect } from 'react';

import { ProfilsConfig } from '../../pages/ProfilsConfig';
import { ChatRoom } from '../../pages/ChatRoom';
import { MonProfil } from '../../pages/MonProfil';
import MonCompte from '../MonCompte';


import { useFetch } from '../../utils/hooks/fetch.jsx';
import { useFetchAllProfils } from '../../utils/hooks/FetchAllProfils';
import { useFetchAllPost } from '../../utils/hooks/FetchAllPost';
import { useFetchAllPostOneUser } from '../../utils/hooks/FetchAllPostOneUser';

import io from 'socket.io-client';

function Navigation({ validToken, navigation, Admin }) {
    // se connecte au socket du server 
    const socket = io.connect('http://localhost:3000');

    // contient la liste des utilisateur connecter 
    const [userCo, setUserCo] = useState([]);

    // state de connexion 
    const [Co, setCo] = useState(false);

    // contient le profil utilisateur 
    const [user_profil, setUser_profil] = useState();
    // récupère le profil utilisateur 
    const { data } = useFetch('http://localhost:3000/api/profil/getOneData');
    // si un profil est récupéré et qu'aucun profil n'est present 
    if (data && !user_profil) {
        // si le tableau récupéré contient au moins un profil
        if (data.length !== 0) {
            // ajoute les information du profil dans le state 
            setUser_profil(data[0]);
        }
    }

    // récupère tous les utilisateurs présents
    const { AllProfils } = useFetchAllProfils('http://localhost:3000/api/profil/getAllProfils')


    // récupère tous les posts présents 
    const { AllPost } = useFetchAllPost('http://localhost:3000/api/post/getAllPost')
    // contient la liste des poste 
    const [postAll, setPostAll] = useState()
    // si la liste des poste est déclaré et que le state n'est pas déclaré 
    if (AllPost && postAll === undefined) {
        // ajoute le tableau des poste au state  
        setPostAll(AllPost);
    }

    // récupère tous les poste de l'utilisateur connecté 
    const { UserPosts } = useFetchAllPostOneUser('http://localhost:3000/api/post/getAllPostOneUser')
    const [PostsUser, setPostUser] = useState()
    if (UserPosts && !PostsUser) {
        setPostUser(UserPosts)
    }


    // gère le système de visualisation connexion 
    useEffect(() => {

        // si un profil utilisateur est présent
        // si le token est valide 
        // si l'utilisateur n'est pas déjà connecté 
        if (user_profil && validToken && !Co) {

            // inform le server de la connexion 
            socket.emit('connexion', user_profil.userId)


        }
        // si un client est connecté 
        // ou si le client se déconnecte 
        socket.on('userCo', (userCo) => {

            // ajoute le tableau dans le state 
            setUserCo(userCo);
            // passe le state de connexion socket a true 
            return setCo(true)
        });


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user_profil])

    // gère le système de poste (socket)
    useEffect(() => {

        // écoute l'événement post 
        socket.on('post', (post) => {

            // si postAll est déclaré 
            if (postAll) {

                // crée un tableau avec le post et les poste deja présent 
                let postadd = [JSON.parse(post), ...postAll]

                // met a jour le state : ajoute tout les poste 
                setPostAll(postadd)

                // met a jour le state : ajoute le tableau des post de l'utilisateur 
                setPostUser(postadd.filter((e) => e.userId === user_profil.userId))

            }
        })

        // écoute l'événement PostDeleted 
        socket.on('PostDeleted', (post) => {

            // si postAll est déclaré 
            if (postAll) {

                // récupère tout le poste sans le poste supprimé
                setPostAll(postAll.filter((e) => e.id !== JSON.parse(post)))

            }
        })


    }, [postAll, socket, user_profil])


    return (
        <>{
            !user_profil ?
                <ProfilsConfig />
                :
                navigation === 'actualité' ?
                    <ChatRoom admin={Admin} PostsUser={PostsUser} setPostUser={setPostUser} postAll={postAll} setPostAll={setPostAll} AllProfils={AllProfils} user_profil={user_profil} userCo={userCo} socket={socket} />
                    : navigation === 'compte' ?
                        <MonCompte user_profil={user_profil} admin={Admin} AllProfils={AllProfils} />
                        : navigation === 'profil' &&
                        <MonProfil user_profil={user_profil} socket={socket} PostsUser={PostsUser} setPostUser={setPostUser} />
        }
        </>
    )
}

export default Navigation