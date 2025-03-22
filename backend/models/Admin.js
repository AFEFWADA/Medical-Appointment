const mongoose = require("mongoose");
const User = require("./UserModel");

const AdminSchema = new mongoose.Schema({
  permissions: [String]  // Liste des permissions spécifiques à l'admin
});

module.exports = User.discriminator("admin", AdminSchema);
