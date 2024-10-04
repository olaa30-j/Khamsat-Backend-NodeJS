import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const adminSchema = new mongoose.Schema({
  first_name: {
    ar: {
      type: String,
    },
    en: {
      type: String,
    },
  },
  last_name: {
    ar: {
      type: String,
    },
    en: {
      type: String,
    },
  },
  profile_picture_url: String,
  username: {
    type: String,
    min: (4, "minimum 4 characters"),
    max: (10, "maximum 10 characters"),
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
});

adminSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    let admin = this;
    bcrypt
      .genSalt(10)
      .then((salt) => {
        bcrypt.hash(admin.password, salt).then((hash) => {
          admin.password = hash;
          next();
        });
      })
      .catch(() => {
        throw new Error("Cannot create/update admin");
      });
  } else {
    next();
  }
});

const AdminSchema = mongoose.model("Admin", adminSchema);
export default AdminSchema;
