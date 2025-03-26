const mongoose = require("mongoose");
const User = require("./UserModel");

const PatientSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      match: [/^\+?\d{9,15}$/, "Invalid phone number format"],
    },
  },
  { timestamps: true }
);

const Patient = User.discriminator("patient", PatientSchema);
module.exports = Patient;
