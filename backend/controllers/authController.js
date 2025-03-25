const UserModel = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const Admin = require("../models/Admin");

const registerController = async (req, res, next) => {
    try {
        const { name, lastName, email, password, role, specialty, experience, address, phone, permissions } = req.body;

        if (!name || !lastName || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already registered. Please log in" });
        }

        let user;
        if (role === "doctor") {
            if (!specialty || !experience) {
                return res.status(400).json({ success: false, message: "Specialty and experience are required for doctors" });
            }
            user = await Doctor.create({ name, lastName, email, password, role, specialty, experience });

        } else if (role === "patient") {
            if (!address || !phone) {
                return res.status(400).json({ success: false, message: "Address and phone number are required for patients" });
            }
            usesr = await Patient.create({ name, lastName, email, password, role, address, phone });

        } else if (role === "admin") {
            if (!permissions || permissions.length === 0) {
                return res.status(400).json({ success: false, message: "Admin must have at least one permission" });
            }
            user = await Admin.create({ name, lastName, email, password, role, permissions });

        } else {
            return res.status(400).json({ success: false, message: "Invalid role" });
        }

        const token = user.createJWT();
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                name: user.name,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                specialty: user.specialty || null,
                experience: user.experience || null,
                address: user.address || null,
                phone: user.phone || null,
                permissions: user.permissions || null,
            },
            token,
        });

    } catch (error) {
        next(error);
    }
};

module.exports = { registerController };


const loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please provide all fields" });
        }

        // Trouver l'utilisateur avec le mot de passe
        const user = await UserModel.findOne({ email }).select("+password role");

        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid email" });
        }

        // Vérification des logs
        console.log("User found:", user);
        console.log("Stored hashed password:", user.password);

        // Comparaison du mot de passe
        const passwordMatch = await bcrypt.compare(password, user.password);
        console.log("Password match result:", passwordMatch);

        if (!passwordMatch) {
            return res.status(401).json({ success: false, message: "Invalid password" });
        }

        // Générer un token
        const token = user.createJWT();
        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                name: user.name,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
            },
            token,
        });
    } catch (error) {
        console.error("Server error:", error);
        next(error);
    }
};


module.exports = {
    registerController,
    loginController,
};
