const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const postCtrl = require('../controllers/post');
const multer = require('../middleware/multer-config-post')

// si /api/post/getAllPost est présent dans l'URL return la fonction getAllData présent dans ../controllers/post
router.post('/getAllPost', auth, postCtrl.getAllPost);

// si /api/post/getAllPostUser est présent dans l'URL return la fonction getAllData présent dans ../controllers/post
router.get('/getAllPostOneUser', auth, postCtrl.getAllPostOneUser);

// si /api/post/addPostData est présent dans l'URL return la fonction AddProfilsData présent dans ../controllers/post
router.post('/addPostData', auth, multer, postCtrl.AddPostData);

// si /api/post/ModifyPostData est présent dans l'URL return la fonction AddProfilsData présent dans ../controllers/post
router.post('/ModifyPostData', auth, multer, postCtrl.ModifyPostData);

// si /api/post/DeletedPostData est présent dans l'URL return la fonction AddProfilsData présent dans ../controllers/post
router.post('/DeletedPostData', auth, postCtrl.DeletedPostData);

// si /api/post/likes est présent dans l'URL return la fonction AddProfilsData présent dans ../controllers/post
router.post('/likes', auth, postCtrl.likes);

module.exports = router;