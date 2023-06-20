![Banner](/images/readme_monvieuxgrimoire.webp)

## Technologies

- NodeJS
- Express
- MongoDB


## Description

[Projet 7](https://openclassrooms.com/fr/paths/717/projects/1335/assignment) réalisé dans le cadre du programme de formation Développeur Web chez OpenClassrooms.

> Développez le back-end d'un site de notation de livres

### Contexte

Je suis développeuse back-end en freelance depuis maintenant un an dans la région de Lille. J'ai l’habitude de travailler avec Kévin, un développeur front-end plus expérimenté que moi, et qui a déjà un bon réseau de contacts dans le milieu.  

Kévin me contacte pour vous proposer de travailler avec lui en mutualisant nos compétences front / back sur un tout nouveau projet qui lui a été proposé. Il s’agit d’une petite chaîne de librairies qui souhaite ouvrir un site de référencement et de notation de livres.  

> ### Compétences évaluées :
>
> - Implémenter un modèle logique de données conformément à la réglementation
> - Stocker des données de manière sécurisée
> - Mettre en œuvre des opérations CRUD de manière sécurisée


## Exigence de l’API

![specifications](/images/readme_specifications_api.webp)

### API Errors

Les erreurs éventuelles doivent être renvoyées telles qu'elles sont produites, sans modification ni ajout. Si
nécessaire, utilisez une nouvelle Error().

### API Routes

Toutes les routes pour les livres doivent disposer d’une autorisation (le token est envoyé par le front-end avec
l'en-tête d’autorisation « Bearer »). Avant qu’un utilisateur puisse apporter des modifications à la route livre (book),
le code doit vérifier si le user ID actuel correspond au user ID du livre. Si le user ID ne correspond pas, renvoyer
« 403: unauthorized request ». Cela permet de s'assurer que seul le propriétaire d’un livre puisse apporter des
modifications à celui-ci.

### Models
```sh
User {  
    email : String - adresse e-mail de l’utilisateur (unique)  
    password : String - mot de passe haché de l’utilisateur  
}

Book {  
    userId : String - identifiant MongoDB unique de l'utilisateur qui a créé le livre  
    title : String - titre du livre  
    author : String - auteur du livre  
    imageUrl : String - illustration/couverture du livre  
    year: Number - année de publication du livre  
    genre: String - genre du livre  
    ratings : [  
        {  
            userId : String - identifiant MongoDB unique de l'utilisateur qui a noté le livre  
            grade : Number - note donnée à un livre  
        }  
    ] - notes données à un livre  
    averageRating : Number - note moyenne du livre  
}
```

### Sécurité

- Le mot de passe de l'utilisateur doit être haché.
- L'authentification doit être renforcée sur toutes les routes livre (book) requises.
- Les adresses électroniques dans la base de données sont uniques, et un plugin Mongoose approprié est utilisé pour garantir leur unicité et signaler les erreurs.
- La sécurité de la base de données MongoDB (à partir d'un service tel que MongoDB Atlas) ne doit pas empêcher l'application de se lancer sur la machine d'un utilisateur.
- Les erreurs issues de la base de données doivent être remontées.


## Installation :

1. Dans un fichier, cloner le backend du projet :
```sh
git clone https://github.com/AbreuGeorgie/P7-Dev-Web-livres
```
2. Dans ce même fichier, cloner le frontend du projet :
```sh
git clone https://github.com/OpenClassrooms-Student-Center/P7-Dev-Web-livres.git
```
3. Nous avons maintenant un fichier qui contient le frontend et le backend du projet;
4. Installer les dépendances du backend : 
```sh
cd backend
```
```sh
npm install
```
5. Démarrer le serveur : 
```sh
nodemon server
```
6. Installer les dépendances du frontend :
```sh
cd frontend
```
```sh
npm install
```
7. Lancer l'application :
```sh
npm start
```
> Par défaut le serveur s'ouvre sur le port http://localhost:4000 et l'application sur le port http://localhost:3000

### Utilisateurs créé afin de tester l'application :
```sh
[
    {
        "email":"great.finch321@maildrop.cc",
        "password":"azerty123"
    },
    {
        "email":"loud.spider953@maildrop.cc",
        "password":"azerty123"
    },
]
```


## Développé avec :

- [Visual Studio Code](https://code.visualstudio.com/) - Éditeur de texte
- [NodeJS](https://nodejs.org/en/docs) - Environnement d'exécution JavaScript côté serveur, multiplateforme et open source
- [Express](https://expressjs.com/) - Framework d’applications web
- [MongoDB](https://www.mongodb.com/fr-fr) - Base de données NoSQL orientée documents
- [Mongoose](https://mongoosejs.com/docs/guide.html) - Bibliothèque de programmation orientée objet JavaScript qui crée une connexion entre MongoDB et l'environnement d'exécution JavaScript Node.js
- [GitHub](https://github.com/) - Outil de gestion de versions


## Tests fonctionnels

- Tests à réaliser :

- [x] sur la page d'accueil, tous les livres doivent s'afficher;
- [x] cliquer sur "Se connecter", la page de connexion doit s'afficher avec le formulaire de connexion;
- [x] choisir une adresse mail ainsi qu'un mot de passe pour s'inscrire, ou utiliser un des email/password de connexion donnés dans la section installation ci-dessus pour se connecter;

- [x] cliquer sur "Ajouter un livre", la page d'ajout de livre doit s'afficher, avec le formulaire d'ajout de livre;
- [x] remplir le formulaire en remplissant bien tous les champs et cliquer sur "Publier", si tous les champs ne sont pas rempli une erreur s'affiche, sinon une page notifiant que le livre a bien été publié doit s'afficher;
- [x] cliquer sur "Retour à l'accueil", la page d'accueil doit s'afficher;

- [x] cliquer sur un des livres, une page descriptive du livre doit s'afficher, ainsi qu'en bas de la page les trois livres les mieux notés;
- [x] si l'utilisateur n'a pas encore noté ce livre, on doit pouvoir lui attribuer une note, la moyenne des notes du livre doit être recalculée;
- [x] si l'utilisateur est celui qui a publié le livre, deux bouton s'affiche: "modifier" et "supprimer"; 
  - [x] si on clique sur "supprimer", un message s'affiche nous demandant la confirmation de la suppression, si on confirme, une page confirmant la suppression s'affiche ainsi qu'un un bouton "Retour à l'accueil";
  - [x] si on clique sur "modifier", la page avec le formulaire de modification doit apparaitre, une fois les champs remplis, lorsqu'on clique sur "Publier", on est redirigé vers la page d'accueil;

- [x] cliquer sur "Se déconnecter", et une fois déconnecter : 
  - [x] si on clique sur ajouter un livre, on est redirigé vers la page de connexion/inscription;
  - [x] si on clique sur un livre, la page de description du livre s'affiche mais on ne peut plus ajouter de notes;


## Auteur :

**Georgie Abreu** : [**GitHub**](https://github.com/AbreuGeorgie/)