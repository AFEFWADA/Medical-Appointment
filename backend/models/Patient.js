const mongoose = require("mongoose");
const User = require("./UserModel");

const PatientSchema = new mongoose.Schema({
  address: String,
  phone: String
});

module.exports = User.discriminator("patient", PatientSchema);
