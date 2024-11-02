import mongoose from "mongoose";

const ordersSchema = new mongoose.Schema(
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
        quantity: {
          type: Number,
          required: true,
        },
        upgrades: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Upgrades",
          },
        ],
      },
    ],
    status: {
      type: String,
      enum: [
        "Awaiting Instructions",
        "In Progress",
        "Awaiting Confirmation",
        "Delivered",
        "Canceled",
      ],
      required: true,
      default:"Awaiting Confirmation"
    },
    order_number: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
    },
  },
  { timestamps: true }
);

const Orders = mongoose.model("Orders", ordersSchema);
export default Orders;
