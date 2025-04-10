const Appointment = require("../models/Appointment");

// Create a new appointment with file uploads
exports.createAppointment = async (req, res) => {
  try {
    const { name, lastName, gender, mobile, email, address, date, fromTime, toTime, doctor, treatment, notes } = req.body;
    const images = req.files ? req.files.map(file => file.path) : [];

    const newAppointment = new Appointment({
      user: req.user.userId, 
      name,
      lastName,
      gender,
      mobile,
      email,
      address,
      date,
      fromTime,
      toTime,
      doctor,
      treatment,
      notes,
      images,
    });

    await newAppointment.save();

    res.status(201).json({
      success: true,
      message: "Rendez-vous enregistré avec succès!",
      appointment: newAppointment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
  }
};


// Récupérer tous les rendez-vous
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json({ success: true, appointments });

  } catch (error) {
    res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
  }
};


exports.getAppointmentsByName = async (req, res) => {
    try {
      const searchTerm = req.params.name; 
  
      
      const filter = {
        $or: [
          { doctor: { $regex: searchTerm, $options: 'i' } }, // Recherche insensible à la casse pour le nom du médecin
          { name: { $regex: searchTerm, $options: 'i' } },   // Recherche insensible à la casse pour le nom du patient
          { lastName: { $regex: searchTerm, $options: 'i' } } // Recherche insensible à la casse pour le prénom du patient
        ]
      };
  
      // Effectuer la recherche dans la base de données
      const appointments = await Appointment.find(filter);
  
      if (appointments.length === 0) {
        return res.status(404).json({ success: false, message: "Aucun rendez-vous trouvé pour ce nom" });
      }
  
      res.status(200).json({ success: true, appointments });
  
    } catch (error) {
      res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
  };
  
  

exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Rendez-vous non trouvé" });
    }

    res.status(200).json({ success: true, appointment });

  } catch (error) {
    res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedAppointment) {
      return res.status(404).json({ success: false, message: "Rendez-vous non trouvé" });
    }

    res.status(200).json({ success: true, message: "Rendez-vous mis à jour", appointment: updatedAppointment });

  } catch (error) {
    res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!deletedAppointment) {
      return res.status(404).json({ success: false, message: "Rendez-vous non trouvé" });
    }

    res.status(200).json({ success: true, message: "Rendez-vous supprimé" });

  } catch (error) {
    res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
  }
};
