const mongoose = require("mongoose");
const User = require("./UserModel");

const DoctorSchema = new mongoose.Schema({
  specialty: {
    type: String,
    required: [true, "Specialty is required"],
    trim: true,
  },
  experience: {
    type: Number,
    required: [true, "Experience is required"],
    min: [1, "Experience must be at least 1 year"],
  }
});

const Doctor = User.discriminator("doctor", DoctorSchema);
module.exports = Doctor;
