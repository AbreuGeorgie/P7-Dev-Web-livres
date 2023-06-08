const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
  userId: { type: String, required: true }, // - identifiant MongoDB unique de l'utilisateur qui a créé le livre
  title: { type: String, required: true }, // - titre du livre
  author: { type: String, required: true }, // - auteur du livre
  year: { type: Number, required: true }, // - année de publication du livre
  genre: { type: String, required: true }, // - genre du livre
  ratings: [
    {
      userId: String, // - identifiant MongoDB unique de l'utilisateur qui a noté le livre
      grade: Number, // - note donnée à un livre
    },
  ], // - notes données à un livre
  averageRating: Number, // - note moyenne du livre
  imageUrl: { type: String, required: true }, // - image de couverture du livre
});

module.exports = mongoose.model("Book", bookSchema);
