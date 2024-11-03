import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";


const usersSchema = new mongoose.Schema(
  {
    username:{
      type: String,
    },
    account_type: {
      type: String,
      enum: ["seller", "buyer"],
    },
    password: {
      type: String,
      validate: {
        validator: function (v) {
          return validator.isStrongPassword(v);
        },
      },
    },
    email: {
      type: String,
      unique: true,
      validate: {
        validator: function (v) {
          return validator.isEmail(v);
        },
      },
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    first_name: {
      ar: {
        type: String,
        required: true,
      },
      en: {
        type: String,
        required: true,
      },
    },
    last_name: {
      ar: {
        type: String,
        required: true,
      },
      en: {
        type: String,
        required: true,
      },
    },
    profilePicture: {
      type: String,
      required: true,
    },
    country: String,
    city: String,
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    birth_date: {
      type: mongoose.Schema.Types.Date,
    },
    phone_number: String,
    bio: String,
    financial_info: {
      total_balance: Number,
      pending_balance: Number,
      withdrawable_earnings: Number,
    },
  },
  { timestamps: true }
);

const users = mongoose.model("Users", usersSchema);

export default users;
