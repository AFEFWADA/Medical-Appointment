const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  name  : { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  date: { type: Date, required: true },
  fromTime: { type: String, required: true },
  toTime: { type: String, required: true },
  doctor: { type: String, required: true },
  treatment: { type: String, required: true },
  notes: { type: String },
  images: [{ type: String }], // Stocker les URLs des fichiers
}, { timestamps: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
