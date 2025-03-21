const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const connectDB = require("./Config/db");
const express = require("express");
const cors = require("cors");
const path = require("path");

// Import du middleware d'erreur
// const errorMiddleware = require("./middleware/errorMiddleware"); 

const app = express();
connectDB(); // Connexion à la base de données

// Middleware
app.use(express.json());
app.use(cors());

// Servir le dossier "uploads" comme dossier statique
//app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Middleware global pour gérer les erreurs
//app.use(errorMiddleware);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(` Server is running on port: ${port}...`);
});
