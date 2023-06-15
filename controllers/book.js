const Book = require("../models/book");
const fs = require("fs");

// ajout d'un nouveau livre
exports.createBook = (req, res, next) => {
  // stockage de la requête sous forme de JSON
  const bookObject = JSON.parse(req.body.book);
  // Suppression du faux _id envoyé par le front
  delete bookObject._id;
  // Suppression de _userId
  delete bookObject._userId;
  // Création d'une instance de Book
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  // sauvegarde dans la base de données
  book
    .save()
    .then(() => res.status(201).json({ book: book }))
    .catch((error) => res.status(400).json({ error }));
};

// modification d'un livre existant
exports.modifyBook = (req, res, next) => {
  // Stockage de la requête en JSON dans une constante
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  // Suppression de _userId auquel on ne peut faire confiance
  delete bookObject._userId;
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(403).json({ message: "Requête non autorisée" });
      } else {
        Book.updateOne(
          { _id: req.params.id },
          { ...bookObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Livre modifié!" }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

// suppression d'un livre
exports.deleteBook = (req, res) => {
  // sélection du livre par son id
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      // on compare l'id de la base de donnée à celle de la requête
      if (book.userId != req.auth.userId) {
        res.status(403).json({ message: "Requête non autorisée" });
      } else {
        const filename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Livre supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

// renvoie un seul livre séléctionné grâce à son id
exports.getOneBook = (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

// renvoie un tableau de tous les livres
exports.getAllBooks = (req, res) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

exports.ratingBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      const ratingObject = {
        userId: req.auth.userId,
        grade: req.body.rating,
      };

      const newRatings = [...book.ratings];

      const hasRated = newRatings.some(
        (rating) => rating.userId === req.auth.userId
      );

      if (req.body.rating >= 0 && req.body.rating <= 5) {
        if (hasRated) {
          return res
            .status(400)
            .json({ message: "Vous avez déjà noté ce livre" });
        } else {
          // on ajoute la nouvelle note au tableau ratings
          newRatings.push(ratingObject);
          //on ajoute la nouvelle note
          const totalRatings = newRatings.length;
          const sumRatings = newRatings.reduce(
            (acc, rating) => acc + rating.grade,
            0
          );
          const newAverageRating = sumRatings / totalRatings;

          Book.updateOne(
            { _id: req.params.id },
            {
              ratings: newRatings,
              averageRating: newAverageRating,
              _id: req.params.id,
            }
          )
            .then(() => {
              res.status(200).json(book);
            })
            .catch((error) => {
              res.status(500).json({ error });
            });
        }
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

// renvoie un tableau des 3 livres les mieux notés
exports.bestRating = (req, res, next) => {
  console.log("e");
  Book.find()
    .then((books) => {
      console.log("c", books);
      const bestRating = books
        .sort(
          (currentIndex, nextIndex) =>
            nextIndex.averageRating - currentIndex.averageRating
        )
        .splice(0, 3);
      console.log("b", bestRating);
      res.status(200).json([{ title: "aaaa" }]);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.test = (req, res) => {
  console.log("test test");
};
