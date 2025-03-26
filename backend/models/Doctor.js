const mongoose = require("mongoose");
const User = require("./UserModel");

const DoctorSchema = new mongoose.Schema({
  specialty: {
    type: String,
    trim: true,
  },
  experience: {
    type: Number,
    min: [1, "Experience must be at least 1 year"],
  }
});


const Doctor = User.discriminator("doctor", DoctorSchema);
module.exports = Doctor;
