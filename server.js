const express = require('express'); //requis pour créer l'application express

const dotenv = require('dotenv'); //pour charger les variables d'environnement à partir du fichier .env
const result = dotenv.config();

const bookRoutes = require('./routes/book');//import des routes des livres
const userRoutes = require('./routes/user');//import des routes des utilisateurs
const path = require('path');//permet de gérer les chemins des fichiers

const mongoose = require('mongoose');//permet d'établir une connexion à la base de données MongoDB

const app = express();//instance de l'appli créée avec express

app.use(express.json());//middleware utilisé pour analyser les données JSON des requêtes

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');//le middleware est configuré pour permettre l'accès à l'API depuis toutes les origines.
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');//le middleware est configuré pour autoriser les en-têtes spécifiés
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');//le middleware est configuré pour autoriser les méthodes HTTP spécifiées
  next();
});

//CONNEXION AVEC LA BASE DE DONNEES MONGODB
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.dwsdvsd.mongodb.net/?retryWrites=true&w=majority`)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'))

app.use('/images', express.static(path.join(__dirname, 'images')));//ce middleware est utilisé pour servir les fichiers images à partir du répertoire "images"
app.use('/api/books', bookRoutes);//routes des livres définies avec /api/books
app.use('/api/auth', userRoutes);//routes d'authentification des utilisateurs définies avec /api/auth

app.listen('4000');//le serveur écoute sur le port 4000