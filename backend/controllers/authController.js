const UserModel = require("../models/UserModel");
const bcrypt = require("bcryptjs");

const registerController = async (req, res, next) => {
    try {
        const { name, email, password, lastName } = req.body;

        // Vérification des champs
        if (!name) return res.status(400).json({ success: false, message: "Name is required" });
        
        if (!lastName) return res.status(400).json({ success: false, message: "Last name is required" });

        if (!email) return res.status(400).json({ success: false, message: "Email is required" });

        if (!password || password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
        }

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already registered. Please log in" });
        }

        // Hacher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await UserModel.create({  email, name ,lastName , password: hashedPassword });

        // Générer un token
        const token = user.createJWT();
        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                name: user.name,
                lastName: user.lastName,
                email: user.email,
            },
            token,
        });
    } catch (error) {
        next(error);
    }
};

const loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please provide all fields" });
        }

        // Trouver l'utilisateur
        const user = await UserModel.findOne({ email }).select("+password +role");
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid email" });
        }

        console.log("Comparing passwords:", password, "vs", user.password);

        // Comparer les mots de passe
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
