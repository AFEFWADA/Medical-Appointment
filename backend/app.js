const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const connectDB = require("./Config/db");
const express = require("express");
const cors = require("cors");
const path = require("path");

// Import des routes
const authRoutes = require("./routes/authRoutes"); // Routes Auth

// Import du middleware d'erreur
const errorMiddleware = require("./middlewares/errorMiddleware");

const app = express();
connectDB(); // Connexion à MongoDB

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes); // Routes Authentification (Login, Register)


// Servir les fichiers uploadés
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Middleware global pour gérer les erreurs
app.use(errorMiddleware);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(` Server is running on port: ${port}...`);
});
