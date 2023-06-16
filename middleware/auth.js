const jwt = require("jsonwebtoken");//module qui permet de créer et de vérifier des jetons d'authentification

const dotenv = require('dotenv'); //pour charger les variables d'environnement
const result = dotenv.config();

module.exports = (req, res, next) => {//middleware est utilisé pour vérifier l'authentification de l'utilisateur, exécutée avant les routes
  try {

    const token = req.headers.authorization.split(" ")[1];//extrait le token de l'en-tête de la requête (authorization)
    const decodedToken = jwt.verify(token, `${process.env.RANDOM_TOKEN_SECRET}`);//vérifie et décode le token
    const userId = decodedToken.userId;//si succès, le token est décodé et l'id utilisateur extrait

    req.auth = {//userId est ensuite ajouté à l'objet req.auth pour être accessible par les autres middleware et routes
      userId: userId,
    };
    next();
  } catch (error) {//si token invalide
    res.status(401).json({ error });//non autorisé
  }
};
