import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema({
  profile_picture_url: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    minlength: [4, 'minimum 4 characters'], 
    maxlength: [10, 'maximum 10 characters'],
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "admin"
  }
});

// Pre-save hook to hash the password before saving
adminSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (err) {
      next(new Error("Cannot create/update admin"));
    }
  } else {
    next();
  }
});

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
