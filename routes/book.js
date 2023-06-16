const express = require('express');//requis pour créer un router
const router = express.Router();//création du router

//MIDDLEWARES IMPORTÉS POUR ETRE UTILISÉS DANS LES ROUTES
const auth = require ('../middleware/auth');
const multer = require('../middleware/multer-config');
const resizeImage = require('../middleware/resizeImage');

const bookCtrl = require('../controllers/book');//contient les fonctions de contrôle pour chaque route

//ROUTES
router.get('/', bookCtrl.getAllBooks); //afficher tous les livres
router.get('/bestrating', bookCtrl.bestRating); //afficher les 3 livres les mieux notés
router.get('/:id', bookCtrl.getOneBook); //afficher un livre en fonction de son id
router.post('/', auth, multer, resizeImage, bookCtrl.createBook); //ajout d'un nouveau livre
router.put('/:id', auth, multer, resizeImage, bookCtrl.modifyBook); // modification de la fiche d'un livre existant
router.delete('/:id', auth, bookCtrl.deleteBook); //suppression d'un livre par l'utilisateur qui l'a ajouté
router.post('/:id/rating', auth, bookCtrl.ratingBook); //notation des livres

module.exports = router; //routes exportées vers d'autres parties de l'application