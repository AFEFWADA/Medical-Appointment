const mongoose = require("mongoose");
const User = require("./UserModel");

const DoctorSchema = new mongoose.Schema({
  specialty: String,
  experience: Number
});

module.exports = User.discriminator("doctor", DoctorSchema);
