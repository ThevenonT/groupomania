import React from 'react'
import styles from '../../utils/style/components/confirmation/style.module.css'

/**
 * 
 * @param {String} question contient la question a poser a l'utilisateur 
 * @param {Boolean} confirm contient le state de confirmation 
 * @returns element jsx contenant l'alert 
 */
function Confirmation({ question, submit, event, setConfirmBox, MsgImportant }) {

  // si l'événement est définit 
  if (event !== undefined)
    // vérifie si il s'agit du compte administrateur 
    if (event.id === 1) {
      question = ''
      MsgImportant = 'Impossible de supprimé le compte administrateur !'
    }

  return (
    <div className={styles.container_confirmation}>
      <div className={styles.container_confirmation_content}>
        <h1 className={styles.title}>Confirmation</h1>
        <div className={styles.container_texte}>
          <h2 className={styles.important}>{MsgImportant}</h2>
          <h3 className={styles.texte}>{question}</h3>
        </div>
        <div className={styles.container_btn}>
          <p className={styles.valide} onClick={() => submit(event)}>Valider</p>
          <p className={styles.annule} onClick={() => setConfirmBox(false)}>Annuler</p>
        </div>
      </div>
    </div>
  )
}

export default Confirmation
