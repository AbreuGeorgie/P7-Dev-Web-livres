const sharp = require ('sharp');
const fs = require("fs");


const resizeImage = async (req, res, next) => {
    // si le fichier n'existe pas, on passe au middleware suivant 
    if(!req.file) {
        return next();
    };
   try {
 
        await sharp(req.file.path) 
            .resize(null, 500) //redimensionne l'image avec une hauteur de 500px
            .webp({ quality: 80 }) //convertit en webP avec une qualité de 80
            .toFile(`${req.file.path.split('.')[0]}_resize.webp`); //enregistre l'image redimensionnée avec _resize.webp

            //On supprime le fichier d'origine (en utilisant la fonction unlink du module fs)
            fs.unlink(req.file.path, (err) => {
                //on met à jour avec le nouveau chemin de l'image
                req.file.path = `${req.file.path.split('.')[0]}_resize.webp`;
                if(err) {
                    //si erreur:
                    console.log(err);
                };
                //on passe au middleware suivant
                next();
            });
        } catch (error) {
            //si erreur, on renvoi une réponse json avec l'objet de l'erreur
             res.status(500).json({ error });
        };
};

module.exports = resizeImage;