

/**
 * contient le système de visualisation des utilisateurs connecté 
 * @param {*} userCo contient le tableau des utilisateurs connecté  
 * @param {*} users contient le tableau des utilisateurs   
 * @param {*} user_profil contient les information du profil utilisateur   
 */
export function ProfilUtilisateur({ styles, userCo, AllProfils, user_profil }) {

    return (
        <div className={styles.profils}>
            <p>mon profil</p>
            <div className={styles.profil} >
                <div className={styles.userInfo}>
                    <p>{user_profil.nom}</p>
                    <p>{user_profil.prenom}</p>
                </div>
                <img width="60px" src={'http://localhost:3000/' + user_profil.image} alt='' />
                <span className={styles.Co}></span>
            </div>

            <p>profil utilisateurs</p>
            {AllProfils && AllProfils.filter((userr) => userr.userId !== user_profil.userId).map((user) =>
                <div className={styles.profil} key={user.id}>
                    <div className={styles.userInfo}>
                        <p >{AllProfils.filter((User) => User.userId === user.userId)[0].nom}</p>
                        <p>{AllProfils.filter((User) => User.userId === user.userId)[0].prenom}</p>
                    </div>
                    <img width="60px" src={'http://localhost:3000/' + AllProfils.filter((User) => User.userId === user.userId)[0].image} alt='' />
                    {userCo.filter((User) => User.userId === user.userId).length > 0 &&
                        <span className={styles.Co}></span>
                    }

                </div>
            )}
        </div>
    )
}