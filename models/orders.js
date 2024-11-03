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
          ref: "Service",
        },
        quantity: {
          type: Number,
          required: true,
        },
        upgrades: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "upgradeService",
          },
        ],
      },
    ],
    status: {
      ar: {
          type: String,
          enum: [
            "بانتظار التعليمات",
            "جاري تنفيذها",
            "بانتظار الاستلام",
            "تم تسليمها",
            "ملغية",
          ],
          required: true,
          default:"بانتظار التعليمات"
      },
      en: {
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
      }
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

// Middleware to calculate the total price before saving
ordersSchema.pre("save", async function (next) {
  try {
    let total = 0;

    // Loop through each item to calculate its total cost
    for (const item of this.items) {
      // Populate the service and upgrades to get prices
      const service = await mongoose.model("Service").findById(item.service_id);
      if (!service) continue
      let itemTotal = service.price * item.quantity;

      // Add upgrade prices if they exist
      if (item.upgrades && item.upgrades.length > 0) {
        const upgrades = await mongoose.model("upgradeService").find({
          _id: { $in: item.upgrades },
        });
        
        const upgradesTotal = upgrades.reduce((sum, upgrade) => sum + upgrade.price, 0);
        itemTotal += upgradesTotal * item.quantity;
      }

      // Add to the order total
      total += itemTotal;
    }

    // Set the calculated total on the order
    this.total = total;
    next();
  } catch (error) {
    next(error);
  }
});

const Orders = mongoose.model("Orders", ordersSchema);
export default Orders;
