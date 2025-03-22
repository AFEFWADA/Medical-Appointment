const UserModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

// Récupérer tous les utilisateurs
const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find().select('-password'); // Ne pas inclure le mot de passe dans la réponse
        res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// Récupérer un utilisateur par ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        // Vérifier si l'ID est valide
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid user ID" });
        }
        // Rechercher l'utilisateur par ID
        const user = await UserModel.findById(id).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        // Retourner les données utilisateur
        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Mettre à jour le profil de l'utilisateur
const updateProfileController = async (req, res) => {
    try {
        const { name, lastName, job, email, location } = req.body;

        // Récupérer l'utilisateur depuis la base de données
        const user = await UserModel.findById(req.user.userId).select("+password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Mettre à jour les champs seulement s'ils sont fournis
        user.name = name !== undefined ? name : user.name;
        user.lastName = lastName !== undefined ? lastName : user.lastName;
        user.job = job !== undefined ? job : user.job;
        user.location = location !== undefined ? location : user.location;

        // Vérification et mise à jour de l'email
        if (email !== undefined && email.trim() !== "") {
            const emailExists = await UserModel.findOne({ email });
            if (emailExists && emailExists._id.toString() !== user._id.toString()) {
                return res.status(400).json({ success: false, message: "Email already in use" });
            }
            user.email = email;
        }

        // Mettre à jour le mot de passe seulement s'il est fourni
        //if (password && password.trim() !== "") {
            // Hachage du mot de passe avant de le sauvegarder
          //  user.password = await bcrypt.hash(password, 10);

            //console.log(password)
       // }

        // Mettre à jour l'image si un fichier est fourni
        if (req.file) {
            user.img = req.file.path;
        }

        // Sauvegarder les modifications
        await user.save();
        console.log("Updated user:", user);
        // Générer un nouveau token JWT
        const token = user.createJWT();

        // Réponse avec les données mises à jour et le token
        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            token, // Nouveau token
            user: {
                id: user._id,
                name: user.name,
                lastName: user.lastName,
                email: user.email,
                job: user.job,
                location: user.location,
                img: user.img,
            },
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ success: false, message: "Failed to update profile" });
    }
};
const updateUserController = async (req, res, next) => {
    try {
        // Vérifiez si le rôle est présent et s'il est valide
        if (req.body.role && !["user", "admin"].includes(req.body.role)) {
            return res.status(400).json({
                message: "Invalid role. Role must be 'user' or 'admin'.",
            });
        }

        // Mettre à jour l'utilisateur
        const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true, // Cela garantit que les validations du schéma s'appliquent
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found.",
            });
        }

        res.status(200).json({
            message: "User Updated Successfully!",
            data: {
                user,
            },
        });
    } catch (err) {
        next(err);
    }
};

const deleteUser = async (req, res) => {
    try {
        await UserModel.findByIdAndDelete(req.params.id);
        res.status(203).json({
            message: "Users Deleted !!!",
        });
    } catch (err) {
        res.status(400).json({
            message: "fail",
            err,
        });
    }
};
module.exports = { 
    updateProfileController,
    getAllUsers, 
    getUserById,
    updateUserController,
    deleteUser 
};