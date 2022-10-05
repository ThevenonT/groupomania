const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const profilCtrl = require('../controllers/profil');
const multer = require('../middleware/multer-config-profil')

// si /api/post/ est présent dans l'URL return la fonction getAllData présent dans ../controllers/post
router.post('/getAllProfils', auth, profilCtrl.getAllProfils);

// si /api/get/ est présent dans l'URL return la fonction getAllData présent dans ../controllers/post
router.get('/getOneData', auth, profilCtrl.getOneData);

// si /api/post/add est présent dans l'URL return la fonction AddProfilsData présent dans ../controllers/post
router.post('/addProfilsData', auth, multer, profilCtrl.AddProfilsData);

// si /api/post/add est présent dans l'URL return la fonction AddProfilsData présent dans ../controllers/post
router.post('/modifyProfilsData', auth, multer, profilCtrl.ModifyProfilsData);

// si /api/post/add est présent dans l'URL return la fonction AddProfilsData présent dans ../controllers/post
router.post('/deleted', auth, profilCtrl.deleted);



module.exports = router;