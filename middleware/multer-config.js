const multer = require('multer'); //module qui permet de gérer le téléchargement des fichiers

const MIME_TYPES = {//permet de générer le nom de fichier correct lors de l'enregistrement du fichier
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png', 
  'image/webp': 'webp'
};

const storage = multer.diskStorage({//définit la configuration de stockage pour multer
  destination: (req, file, callback) => {//indique à multer où enregistrer les fichiers, si le dossier n'existe pas, multer le crée
    callback(null, 'images');
  },
  filename: (req, file, callback) => {//génère le nom du fichier
    const name = file.originalname.split(' ').join('_');//remplace les espaces par _
    const extension = MIME_TYPES[file.mimetype];//définit l'extension du fichier en fonction du type MIME du fichier
    callback(null, name + Date.now() + '.' + extension);
  }
});

const upload = multer({storage: storage})//upload est créée en fonction des config de stockage définies précédemment

module.exports = upload.single('image');//middleware multer qui s'attend à recevoir un fichier avec le nom de champ "image" dans la requête