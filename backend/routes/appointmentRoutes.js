const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");
const { upload } = require("../middlewares/multerMiddleware");
// Route to create an appointment with file upload
router.post('/create', upload.array('images', 10), appointmentController.createAppointment);

// Other routes (getting, updating, deleting appointments)
router.get("/getAll", appointmentController.getAllAppointments);
router.get("/getById/:id", appointmentController.getAppointmentById);
router.get("/getByname/:name" , appointmentController.getAppointmentsByName);
router.put("/UpdateById/:id", appointmentController.updateAppointment);
router.delete("/delete/:id", appointmentController.deleteAppointment);

module.exports = router;
