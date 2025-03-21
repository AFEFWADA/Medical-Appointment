const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name Is Required"],
        },
        lastName: {
            type: String,
        },
        phone: {
            type: String,
        },
        email: {
            type: String,
            required: [true, "Email is Required"],
            unique: true,
            validate: validator.isEmail,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password length should be greater than 6 characters"],
            select: true,
        },
        role: { type: String, 
                enum: ["patient", "doctor", "admin"], 
                default: "patient" },

        resetPasswordToken: String,
        resetPasswordExpire: Date,
    },
    { timestamps: true }
);

// Middleware pour hacher le mot de passe avant de sauvegarder
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next(); // Ne pas hacher si le mot de passe n'est pas modifié
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
    return JWT.sign({ userId: this._id, role: this.role }, process.env.SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

module.exports = mongoose.model("User", userSchema);