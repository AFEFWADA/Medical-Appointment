const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Charger les variables d'environnement
dotenv.config({ path: "./.env" });

// Connexion a MongoDB avec gestion des erreurs améliorée
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected Successfully!        :) ");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    process.exit(1); // arrete l'application en cas d'erreur critique
  }
};

// Exporter la fonction de connexion
module.exports = connectDB;
