const express = require("express");

const { userAuth, isAdmin, isDoctor, isPatient } = require("../middlewares/authMiddleware");

const router = express.Router();

// Route pour le dashboard admin
router.get("/admin-dashboard", userAuth, isAdmin, (req, res) => {
    res.json({ message: "Welcome to the admin dashboard" });
});

// Route pour le dashboard doctor
router.get("/doctor-dashboard", userAuth, isDoctor, (req, res) => {
    res.json({ message: "Welcome to the doctor dashboard" });
});

// Route pour le dashboard patient
router.get("/patient-dashboard", userAuth, isPatient, (req, res) => {
    res.json({ message: "Welcome to the patient dashboard" });
});

module.exports = router;
