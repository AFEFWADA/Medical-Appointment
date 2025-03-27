const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

dotenv.config();

const app = express();

// Vérification du fichier .env
if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI est manquant dans le fichier .env !");
    process.exit(1);
}
console.log("🔍 MONGO_URI:", process.env.MONGO_URI);

// Middleware
app.use(cors());
app.use(express.json());

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected successfully  :)"))
    .catch(err => {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1);
    });

// Importation des routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
// Définition des routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/appointments", appointmentRoutes);


// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
    console.error("❌ Erreur serveur :", err);
    res.status(500).json({ message: "Erreur interne du serveur" });
});

// Lancement du serveur
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
