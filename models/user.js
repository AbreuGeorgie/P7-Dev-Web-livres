const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");//utilisé pour vérifier que l'email est bien unique dans la base de données

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },//email de l'utilisateur , email unique
  password: { type: String, required: true },//mot de passe de l'utilisateur
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
