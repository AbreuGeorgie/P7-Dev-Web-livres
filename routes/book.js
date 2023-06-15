const express = require('express');
const router = express.Router();

const auth = require ('../middleware/auth');
const multer = require('../middleware/multer-config')
const resizeImage = require('../middleware/resizeImage')

const bookCtrl = require('../controllers/book');

router.get('/', bookCtrl.getAllBooks);
router.post('/', auth, multer, resizeImage, bookCtrl.createBook);
router.get('/:id', bookCtrl.getOneBook);
router.put('/:id', auth, multer, resizeImage, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);
router.post('/:id/rating', auth, bookCtrl.ratingBook);
router.get('/bestrating', bookCtrl.test);
module.exports = router;