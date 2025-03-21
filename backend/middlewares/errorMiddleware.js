const errorMiddleware = (err, req, res, next) => {
    console.error("🚨 Error:", err);

    let defaultErrors = {
        statusCode: 500,
        message: err.message || "Une erreur interne est survenue.",
    };

    // Gestion des erreurs de validation Mongoose
    if (err.name === "ValidationError") {
        defaultErrors.statusCode = 400;
        defaultErrors.message = Object.values(err.errors)
            .map((item) => item.message)
            .join(", ");
    }

    // Gestion des erreurs de duplication (ex: email unique)
    if (err.code && err.code === 11000) {
        defaultErrors.statusCode = 400;
        defaultErrors.message = `${Object.keys(err.keyValue)} field must be unique`;
    }

    res.status(defaultErrors.statusCode).json({ success: false, message: defaultErrors.message });
};

module.exports = errorMiddleware;
