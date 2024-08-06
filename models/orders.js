import mongoose from "mongoose";

const ordersSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    item: {
      service_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Services",
      },
      quantity: Number,
      upgrades: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Upgrades",
        },
      ],
    },
    status: {
      type: String,
      enum: [
        "Awaiting Instructions",
        "In Progress",
        "Awaiting Confirmation",
        "Delivered",
        "Canceled",
      ],
    },
    order_number: {
        type: Number,
        required: true,
    },
    total: Number,
  },
  { timestamps: true }
);

const orders = mongoose.model("Orders", ordersSchema);
export default orders;
