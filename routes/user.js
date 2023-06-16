const express = require('express');//requis pour créer un router
const router = express.Router();//création du router

const userCtrl = require('../controllers/user');//contient les fonctions de contrôle pour chaque route

router.post('/signup', userCtrl.signup);//route pour inscription
router.post('/login', userCtrl.login);//route pour connexion

module.exports = router;//routes exportées vers d'autres parties de l'application