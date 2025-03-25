const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        lastName: {
            type: String,
            required: [true, "Last name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            validate: [validator.isEmail, "Invalid email format"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"],
            select: false, // Ne pas renvoyer le mot de passe par défaut
        },
        role: { 
            type: String, 
            enum: ["patient", "doctor", "admin"], 
            default: "patient" 
        },
    },
    { 
        timestamps: true,
        discriminatorKey: "role" // Clé pour différencier les sous-modèles
    }
);

// Middleware pour hacher le mot de passe avant de sauvegarder
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Méthode pour comparer le mot de passe
userSchema.methods.comparePassword = async function (userPassword) {
    return await bcrypt.compare(userPassword, this.password);
};

// Méthode pour créer un token JWT
userSchema.methods.createJWT = function () {
    return JWT.sign(
        { userId: this._id, role: this.role },
        process.env.JWT_SECRET || "defaultsecret", // Fallback pour éviter les erreurs en dev
        { expiresIn: process.env.JWT_EXPIRE || "1d" }
    );
};

module.exports = mongoose.model("User", userSchema);
