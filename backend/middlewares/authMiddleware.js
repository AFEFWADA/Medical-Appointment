const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Accès refusé. Aucun token fourni." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Ajoute les infos de l'utilisateur au `req`
    next();
  } catch (error) {
    res.status(401).json({ message: "Token invalide." });
  }
};

module.exports = authMiddleware;
