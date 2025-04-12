const mongoose = require("mongoose");
const User = require("./UserModel");


const AdminSchema = new mongoose.Schema(
  {
    permissions: {
      type: [String],
      default: ["view_dashboard"]
    },
  },
  { timestamps: true }
);

const Admin = User.discriminator("admin", AdminSchema);
module.exports = Admin;
