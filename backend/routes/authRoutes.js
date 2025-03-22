const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel"); // Modèle User (classe parent)
const Doctor = require("../models/Doctor"); // Modèle Doctor (hérite de User)
const Patient = require("../models/Patient"); // Modèle Patient (hérite de User)

const router = express.Router();

// Route d'inscription (Register)
router.post("/register", async (req, res) => {
    try {
        const { firstName, lastName, email, password, role } = req.body;

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Cet email est déjà utilisé." });

        // Hasher le mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let newUser;

        // Vérifier le rôle et créer l'utilisateur approprié
        if (role === "doctor") {
            newUser = new Doctor({ firstName, lastName, email, password: hashedPassword });
        } else if (role === "patient") {
            newUser = new Patient({ firstName, lastName, email, password: hashedPassword });
        } else if (role === "admin") {
            newUser = new User({ firstName, lastName, email, password: hashedPassword, role: "admin" });
        } else {
            return res.status(400).json({ message: "Rôle invalide." });
        }

        // Sauvegarder dans la base de données
        await newUser.save();
        res.status(201).json({ message: "Utilisateur créé avec succès !" });
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
});

// Route de connexion (Login)
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Vérifier si l'utilisateur existe
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé." });

        // Vérifier le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Mot de passe incorrect." });

        // Générer un token JWT
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.status(200).json({ message: "Connexion réussie", token, user });
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
});

module.exports = router;
