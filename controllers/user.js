const bcrypt = require("bcrypt"); //utilisé pour le hachage sécurisé des mots de passe
const jwt = require("jsonwebtoken"); //utilisé pour la génération et la vérification des token d'authentification

const dotenv = require('dotenv'); //utilisé pour charger les variables d'environnement à partir du fichier .env
const result = dotenv.config();

const User = require("../models/user"); //modèle utilisateur défini dans le fichier user.js

exports.signup = (req, res) => {// permet à un utilisateur de créer un compte

  bcrypt
    .hash(req.body.password, 10)//bcrypt.hash utilisé pour hacher le mot de passe fourni par l'utilisateur
    .then((hash) => {

      const user = new User({ //nouvel utilisateur créé en utilisant le modèle User et les informations fournies par l'utilisateur
        email: req.body.email,
        password: hash,
      });

      user
        .save()// nouvel utilisateur sauvegardé dans la base de données
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))// sauvegarde réussie
        .catch((error) => res.status(400).json({ error })); //erreur lors de la création de l'utilisateur
    })
    .catch((error) => res.status(500).json({ error }));//erreur lors de la requête
};

exports.login = (req, res) => {//permet à un utilisateur de se connecter avec ses informations d'identification
  
  User.findOne({ email: req.body.email })//recherche dans la base de données un utilisateur correspondant à l'adresse e-mail fournie dans la requête
    .then((user) => {
      if (!user) {//Si aucun utilisateur n'est trouvé, c'est que l'adresse e-mail n'est pas enregistrée dans la base de données
        return res
          .status(401)//non autorisé
          .json({ message: "Paire login/mot de passe incorrecte" });
      }
      //si un utilisateur correspondant à l'adresse e-mail est trouvé
      bcrypt
        .compare(req.body.password, user.password)//compare le mot de passe fourni dans la requête (req.body.password) avec le mot de passe haché stocké dans la base de données (user.password)
        .then((valid) => {
          if (!valid) {//si les mots de passe ne correspondent pas
            return res
              .status(401)//non autorisé
              .json({ message: "Paire login/mot de passe incorrecte" });
          }
          res.status(200).json({//si les mots de passe correspondent c'est que l'utilisateur est authentifié avec succès
            userId: user._id,//reponse json contenant l'id de l'utilisateur 
            token: jwt.sign({ userId: user._id }, `${process.env.RANDOM_TOKEN_SECRET}`), //et le token généré par la méthode jwt.sign
          });
        })
        .catch((error) => res.status(500).json({ error }));//si erreur dans la comparaison des mots de passe
    })
    .catch((error) => res.status(500).json({ error }));//si erreur dans la recherche de l'utilisateur
};
