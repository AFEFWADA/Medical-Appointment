const JWT = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No authorization header provided" });
    }

    const token = authHeader.split(" ")[1];
    try {
        const payload = JWT.verify(token, process.env.JWT_SECRET);
        req.user = { userId: payload.userId, role: payload.role };

        console.log("Authenticated user:", req.user); // 🔍 Vérification du rôle et userId
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired" });
        } else if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token" });
        }
        return res.status(401).json({ message: "Authentication failed" });
    }
};

const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "You are not authorized as admin" });
    }
    next();
};

const isDoctor = (req, res, next) => {
    if (!req.user || req.user.role !== "doctor") {
        return res.status(403).json({ message: "You are not authorized as a doctor" });
    }
    next();
};

const isPatient = (req, res, next) => {
    if (!req.user || req.user.role !== "patient") {
        return res.status(403).json({ message: "You are not authorized as a patient" });
    }
    next();
};

module.exports = { userAuth, isAdmin, isDoctor, isPatient };
