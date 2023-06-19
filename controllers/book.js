//GESTION DES OPERATIONS CRUD (CREATE, READ, UPDATE, DELETE)

const Book = require("../models/book");
const fs = require("fs");

// AJOUT D'UN NOUVEAU LIVRE
exports.createBook = (req, res, next) => {

  const bookObject = JSON.parse(req.body.book); // stockage de la requête sous forme de JSON
  delete bookObject._id; // Suppression du faux _id envoyé par le front
  delete bookObject._userId; // Suppression de _userId

  const book = new Book({ // Création d'une instance de Book
    ...bookObject, 
    userId: req.auth.userId, //id de l'utilisateur authentifié
    imageUrl: `${req.protocol}://${req.get("host")}/${req.file.path}`}); //url du livre
  
  book
    .save()// sauvegarde du livre dans la base de données
    .then(() => res.status(201).json({ book: book }))//réponse json avec le livre créé
    .catch((error) => res.status(500).json({ error }))
};

// MODIFICATION D'UN LIVRE EXISTANT
exports.modifyBook = (req, res, next) => {

  const bookObject = req.file //si image téléchargée avec la requête req.file
    ? {//si oui mise à jour de bookObject en ajoutant l'url de l'image mise à jour
        ...JSON.parse(req.body.book),//crée une copie de l'objet à partir de la chaine JSON
       imageUrl: `${req.protocol}://${req.get("host")}/${req.file.path}`//nouvelle propriété imageUrl contenant l'URL de l'image mise à jour
      }
    : { ...req.body };//si pas d'image téléchargée, alors bookObject est simplement une copie de req.body qui contient les données du livre

  delete bookObject._userId; // Suppression de _userId auquel on ne peut faire confiance
  
  Book.findOne({ _id: req.params.id })// recherche du livre correspondant à l'ID fourni dans la requête req.params.id
    .then((book) => { //si livre trouvé
      if (book.userId != req.auth.userId) { //verifie si ID de l'utilisateur du livre ne correspond pas à l'id de l'utilisateur authentifié
        res.status(403).json({ message: "403: unauthorized request" });//ne correspond pas
      } else { // correspond 
        Book.updateOne(// met à jour avec les nouvelles données
          { _id: req.params.id },
          { ...bookObject, _id: req.params.id }//créer un nouvel objet en copiant toutes les propriétés de bookObject qui contient les nouvelles données du livre et en ajoutant une propriété _id avec la valeur de req.params.id pour garantir que l'id du livre reste inchangé
        )
          .then(() => res.status(200).json({ message: "Livre modifié" })) //succès
          .catch((error) => res.status(500).json({ error })); //erreur
      }
    })
    .catch((error) => { //si livre non trouvé
      res.status(404).json({ error });
    });
};

// SUPPRESSION D'UN LIVRE
exports.deleteBook = (req, res) => {

  Book.findOne({ _id: req.params.id })// recherche du livre correspondant à l'ID fourni dans la requête (req.params.id)
    .then((book) => {//livre trouvé
      
      if (book.userId != req.auth.userId) {// on compare l'id de l'utilisateur du livre à celle de l'utilisateur authentifié
        res.status(403).json({ message: "403: unauthorized request" }); //si les id sont différentes : interdit
      
      } else { // si les 2 id sont identiques
        const filename = book.imageUrl.split("/images/")[1];
        
        fs.unlink(`images/${filename}`, () => { //suppression du fichier image associé au livre avec fs.unlink
          Book.deleteOne({ _id: req.params.id }) //suppression du livre de la base de donnée
            .then(() => {
              res.status(200).json({ message: "Livre supprimé !" });//succès
            })
            .catch((error) => res.status(500).json({ error }));//échec
        });
      }
    })
    .catch((error) => {//livre non trouvé
      res.status(404).json({ error });
    });
};

//RECCUPERATION D'UN LIVRE PAR SON ID
exports.getOneBook = (req, res) => {
  Book.findOne({ _id: req.params.id }) //recherche le livre correspondant à l'id fourni dans la requête (req.params.id)

    .then((book) => res.status(200).json(book)) //livre trouvé, renvoi code 200 avec les détails du livre au format JSON
    .catch((error) => res.status(404).json({ error })); //livre non trouvé
};

//RECCUPERATION DE TOUS LES LIVRES
exports.getAllBooks = (req, res) => {

  Book.find()//reccupère tous les livres de la base de données
    .then((books) => res.status(200).json(books))//livres trouvés, renvoi code 200 avec les livres au format JSON
    .catch((error) => res.status(404).json({ error }));//livre non trouvé
};

//ATTRIBUE UNE NOTE A UN LIVRE
exports.ratingBook = (req, res, next) => {

  Book.findOne({ _id: req.params.id }) //recherche le livre correspondant à l'ID fourni dans la requête (req.params.id)
    .then((book) => {//si livre trouvé
      const ratingObject = {//crée un objet ratingObject contenant : 
        userId: req.auth.userId,//l'ID de l'utilisateur
        grade: req.body.rating,//la note fournie dans la requête (req.body.rating)
      };

      const newRatings = [...book.ratings];//crée un nouveau tableau newRatings en copiant les données du tableau ratings

      const hasRated = newRatings.some(//on vérifie si l'utilisateur a déjà attribué une note à ce livre en parcourant les notes existantes du livre avec some
        (rating) => rating.userId === req.auth.userId
      );

      if (req.body.rating >= 0 && req.body.rating <= 5) {
        if (hasRated) {//si l'utilisateur a déjà attribué une note
          return res
            .status(400)
            .json({ message: "Vous avez déjà noté ce livre" });
        } else {//Si l'utilisateur n'a pas encore attribué une note
          newRatings.push(ratingObject);//on ajoute la nouvelle note au tableau ratings
          //on ajoute la nouvelle note
          const totalRatings = newRatings.length; //nombre total de note dans le tableau newRatings
          const sumRatings = newRatings.reduce( //Cela correspond à la somme de toutes les notes dans le tableau newRatings
            (acc, rating) => acc + rating.grade,// la méthode reduce renvoie la somme totale des notes
            0
          );
          const newAverageRating = sumRatings / totalRatings; //nouvelle note moyenne du livre après l'ajout de la nouvelle note

          Book.updateOne(//met à jour les données du livre dans la base de données avec les nouvelles informations de notation
            { _id: req.params.id },//spécifie le livre à mettre à jour en fonction de son ID
            {
              ratings: newRatings,//met à jour le champ ratings du livre avec le tableau newRatings qui contient les nouvelles notes
              averageRating: newAverageRating,//met à jour le champ averageRating du livre avec la nouvelle note moyenne calculée (newAverageRating)
              _id: req.params.id,//garantit que l'ID du livre reste inchangé
            }
          )
            .then(() => {//livre mis à jour
              res.status(200).json(book);
            })
            .catch((error) => {//erreur
              res.status(500).json({ error });
            });
        }
      }else{
        res.status(400)
      }
    })

    .catch((error) => res.status(404).json({ error }));//livre non trouvé
};

//RECCUPERER LES 3 LIVRES LES MIEUX NOTÉS
exports.bestRating = (req, res, next) => {
  Book.find().sort({averageRating: -1}).limit(3)
  .then((books)=>res.status(200).json(books))
  .catch((error)=>res.status(500).json({ error }));
};



/* 1ère version que j'avais réalisé pour bestrating mais celle ci-dessus est plus optimisée

Book.find()//ne pas retourner tous les livres, voir requete mongoose 
    .then((books) => {//récupère tous les livres de la base de données
      const bestRatingBook = books
        .sort(//trie les livres en fonction de leur note moyenne avec sort
          (currentIndex, nextIndex) => nextIndex.averageRating - currentIndex.averageRating
        )
        .splice(0, 3);// renvoie les trois premiers livres
      res.status(200).json(bestRatingBook);//renvoie les meilleurs livres au format JSON
    })
    .catch((error) => {// erreur lors de la reccupération des livres
      res.status(500).json({ error });
    }); */