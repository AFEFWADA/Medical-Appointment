const UserModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Doctor = require("../models/Doctor");
// Récupérer tous les utilisateurs (admin uniquement)
const getAllUsers = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Access denied" });
        }

        const users = await UserModel.find().select('-password');
        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Récupérer un utilisateur par ID (admin et docteur)
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid user ID" });
        }

        const user = await UserModel.findById(id).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Seul un admin ou un docteur peut voir un patient
        if (req.user.role === "doctor" && user.role !== "patient") {
            return res.status(403).json({ success: false, message: "Access denied" });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Mettre à jour le profil de l'utilisateur (tous les rôles)
const updateProfileController = async (req, res) => {
    try {
        const { name, lastName, specialty, email, location } = req.body;
        const user = await UserModel.findById(req.user.userId).select("+password");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (email && email.trim() !== "" && email !== user.email) {
            const emailExists = await UserModel.findOne({ email });
            if (emailExists && emailExists._id.toString() !== user._id.toString()) {
                return res.status(400).json({ success: false, message: "Email already in use" });
            }
            user.email = email;
        }

        if (name) user.name = name;
        if (lastName) user.lastName = lastName;
        if (specialty) user.specialty = specialty;
        if (location) user.location = location;
        if (req.file) user.img = req.file.path;

        await user.save();

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                lastName: user.lastName,
                email: user.email,
                specialty: user.specialty,
                location: user.location,
                img: user.img,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ success: false, message: "Failed to update profile" });
    }
};

// Mettre à jour un utilisateur (Admin seulement)
const updateUserController = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied" });
        }

        const validRoles = ["patient", "doctor", "admin"];
        if (req.body.role && !validRoles.includes(req.body.role)) {
            return res.status(400).json({ message: "Invalid role. Must be 'patient', 'doctor', or 'admin'." });
        }

        const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({ message: "User Updated Successfully!", data: { user } });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ success: false, message: "Failed to update user" });
    }
};

// Supprimer un utilisateur (Admin seulement)
const deleteUser = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied" });
        }

        const user = await UserModel.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({ message: "User Deleted Successfully!" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ success: false, message: "Failed to delete user" });
    }
};

const addDoctor = async (req, res) => {
    try {
        const { name, lastName, email, password, specialty, experience } = req.body;

        // Validation des champs
        if (!name || !lastName || !email || !password || !specialty || !experience) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Vérifier si l'email est déjà utilisé
        const emailExists = await Doctor.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ success: false, message: "Email already in use" });
        }

        
        const doctor = new Doctor({
            name,
            lastName,
            email,
            password,
            role: "doctor", 
            specialty,
            experience,
        });

        // Sauvegarder le docteur dans la base de données
        await doctor.save();

        // Générer un JWT pour le nouvel utilisateur (docteur)
        const token = doctor.createJWT();

        // Réponse avec le token
        res.status(201).json({
            success: true,
            message: "Doctor added successfully",
            token,
            doctor: {
                id: doctor._id,
                name: doctor.name,
                lastName: doctor.lastName,
                email: doctor.email,
                specialty: doctor.specialty,
                experience: doctor.experience,
            }
        });
    } catch (error) {
        console.error("Error adding doctor:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};
  
const getAllDoctors = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Access denied" });
        }

        const doctors = await UserModel.find({ role: "doctor" }).select("-password");

        res.status(200).json({
            success: true,
            count: doctors.length,
            data: doctors
        });
    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const getAllPatients = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Access denied" });
        }

        const patients = await UserModel.find({ role: "patient" }).select("-password");

        res.status(200).json({
            success: true,
            count: patients.length,
            data: patients
        });
    } catch (error) {
        console.error("Error fetching patients:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};



module.exports = {
    updateProfileController,
    getAllUsers,
    getUserById,
    updateUserController,
    deleteUser,
    addDoctor,
    getAllDoctors,
    getAllPatients,
};
