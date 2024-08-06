import mongoose from "mongoose";

const cartsSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    items: [
        {
            service_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Services",
            },
            quantity: Number
        }
    ],
    subtotal: Number,
    fees: Number,
    total: Number
  },
  { timestamps: true }
);

const carts = mongoose.model("Carts", cartsSchema);
export default carts;
