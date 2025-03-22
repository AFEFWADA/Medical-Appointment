const multer = require("multer");
const path = require("path");
const fs = require("fs");

//  Chemin pour les fichiers uploadés
const uploadPath = path.join(__dirname, "../uploads");

// Créer le dossier "uploads" si nécessaire
if (!fs.existsSync(uploadPath)) {
  try {
    fs.mkdirSync(uploadPath, { recursive: true });
    console.log(` Dossier d'upload créé : ${uploadPath}`);
  } catch (error) {
    console.error("❌ Erreur lors de la création du dossier d'upload :", error);
  }
}

// Configuration de stockage avec Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // 🛠 Nettoyage du nom du fichier pour éviter les problèmes
    const sanitizedFileName = file.originalname.replace(/[:\s]/g, "-");
    const timestamp = new Date().toISOString().replace(/[:]/g, "-");
    cb(null, `${timestamp}-${sanitizedFileName}`);
  },
});

//  Validation des types de fichiers (JPEG, PNG, PDF uniquement)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("❌ Type de fichier non supporté ! Seuls les PDF, JPEG et PNG sont autorisés."), false);
  }
};

//  Configuration de multer avec limites
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, //  Limite de taille (10 Mo)
  fileFilter: fileFilter,
});

//  Exporter l'objet "upload" pour l'utiliser dans les routes
module.exports = { upload };
