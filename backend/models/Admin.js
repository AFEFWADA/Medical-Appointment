const mongoose = require("mongoose");
const User = require("./UserModel");

const AdminSchema = new mongoose.Schema(
  {
    permissions: {
      type: [String], 
      required: [true, "Permissions are required"],
      validate: {
        validator: function (permissions) {
          return permissions.length > 0;
        },
        message: "Admin must have at least one permission",
      },
    },
  },
  { timestamps: true }
);

const Admin = User.discriminator("admin", AdminSchema);
module.exports = Admin;
