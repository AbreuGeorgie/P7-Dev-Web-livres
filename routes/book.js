const express = require('express');
const router = express.Router();

const auth = require ('../middleware/auth');
const multer = require('../middleware/multer-config');
const resizeImage = require('../middleware/resizeImage');

const bookCtrl = require('../controllers/book');

router.get('/', bookCtrl.getAllBooks);
router.get('/bestrating', bookCtrl.bestRating);
router.get('/:id', bookCtrl.getOneBook);
router.post('/', auth, multer, resizeImage, bookCtrl.createBook);
router.put('/:id', auth, multer, resizeImage, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);
router.post('/:id/rating', auth, bookCtrl.ratingBook);


module.exports = router; 