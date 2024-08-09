import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const usersSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    account_type: {
      type: String,
      enum: ["seller", "buyer"],
    },
    first_name: String,
    last_name: String,
    profile_picture_url: String,
    country: String,
    city: String,
    password: String,
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    birth_date: {
      type: mongoose.Schema.Types.Date,
    },
    phone_number: String,
    bio: String,
  },
  { timestamps: true }
);

usersSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    let user = this
    bcrypt
      .genSalt(10)
      .then((salt) => {
        bcrypt.hash(user.password, salt).then((hash) => {
          user.password = hash;
          next()
        });
      })
      .catch(() => {
        throw new Error("Cannot create/update user");
      });
  }
  else{
    next();
  }
});
const users = mongoose.model("Users", usersSchema);

export default users;

/*
{
  "_id": {
    "$oid": "669e4f4d7d50d8114ff5ea6a"
  },
  "username": "ahmed_designs",
  "account_type": "seller",
    "first_name": "Ahmed",
    "last_name": "Hassan",
    "profile_picture_url": "https://example.com/profiles/ahmed_hassan.jpg",
    "country": "مصر",
    "city": "القاهرة",
    "gender": "ذكر",
    "birth_date": "1988-05-15",
    "phone_number": "+20 101 234 5678",
    "bio": "مصمم جرافيك محترف مع خبرة 10 سنوات في تصميم الهويات البصرية"
  "email_addresses": [
    {
      "email": "ahmed.hassan@example.com",
      "added_at": "2022-03-10T14:30:00Z",
      "is_verified": true
    },
    {
      "email": "ahmed_designs@gmail.com",
      "added_at": "2023-01-05T09:15:00Z",
      "is_verified": false
    }
  ],
  "password_hash": "5f4dcc3b5aa765d61d8327deb882cf99",
  "account_status": {
    "verification_status": "verified",
    "join_date": "2022-03-10T14:30:00Z",
    "last_active_date": "2024-07-22T08:45:00Z",
    "account_level": "متميز"
  },
  "payment_methods": {
    "cards": [
      {
        "card_holder_name": "AHMED HASSAN",
        "card_number": "4111111111111111",
        "expiry_month": "09",
        "expiry_year": "2026",
        "cvv": "123"
      }
    ],
    "bank_accounts": [
      {
        "beneficiary_name": "Ahmed Hassan",
        "iban": "EG380019000500000000263180002",
        "swift_code": "NBEGEGCX",
        "beneficiary_address": {
          "line1": "123 شارع التحرير",
          "line2": "شقة 5",
          "city": "القاهرة",
          "state": "القاهرة",
          "country": "مصر",
          "postal_code": "11511"
        }
      }
    ]
  },
  "financial_info": {
    "total_balance": 1500,
    "pending_balance": 250,
    "withdrawable_earnings": 1250
  }
}
*/
