const express = require('express');
const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');

const mongoose = require('mongoose');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

mongoose.connect('mongodb+srv://abreugeorgie:pXLrdgfe2JWBv0wq@cluster0.dwsdvsd.mongodb.net/')
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'))

app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);

app.listen('4000');