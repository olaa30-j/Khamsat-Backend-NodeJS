import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema({
  profile_picture_url: {
    type: String,
    required: true,
    default: "https://res.cloudinary.com/demo/image/upload/c_scale,w_100/d_docs:placeholders:samples:avatar.png/non_existing_id.png",
  },
  userName: {
    type: String,
    minlength: [4, 'minimum 4 characters'], 
    maxlength: [20, 'maximum 20 characters'],
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

adminSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
      return next(new Error("Cannot create/update admin"));
    }
  }
  next();
});

const Admin = mongoose.model("AdminDashboard", adminSchema);
export default Admin;
