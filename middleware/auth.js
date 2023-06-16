const jwt = require("jsonwebtoken");

const dotenv = require('dotenv');
const result = dotenv.config();

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    //chaine de caractère aléatoire meme que l'autre
    const decodedToken = jwt.verify(token, `${process.env.RANDOM_TOKEN_SECRET}`);
    const userId = decodedToken.userId;
    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};
