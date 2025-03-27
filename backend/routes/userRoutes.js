const express = require("express");
const { userAuth, isAdmin, isDoctor, isPatient } = require("../middlewares/authMiddleware");
const { upload } = require("../middlewares/multerMiddleware");

const router = express.Router();

const {
    getAllUsers,
    updateProfileController,
    getUserById,
    updateUserController,
    deleteUser
} = require("../Controllers/userController");

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

// Routes avec l'upload de fichier
router.patch("/update-profile", userAuth, upload.single("img"), updateProfileController);
router.patch("/update-user/:id", userAuth, isAdmin, updateUserController);
router.get("/all-users", userAuth, isAdmin, getAllUsers);
router.get("/user/:id", userAuth, isAdmin, isDoctor, getUserById);
router.delete("/delete-user/:id", userAuth, deleteUser);

router.get("/all-doctors", userAuth, isAdmin, async (req, res) => {
    try {
        const doctors = await UserModel.find({ role: "doctor" }).select("_id name lastName email specialty");
        res.status(200).json({ success: true, doctors });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching doctors" });
    }
});

router.get("/all-patients", userAuth, isAdmin, async (req, res) => {
    try {
        const patients = await UserModel.find({ role: "patient" }).select("_id name lastName email");
        res.status(200).json({ success: true, patients });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching patients" });
    }
});

module.exports = router;
