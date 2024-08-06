import mongoose from "mongoose";

const collectionsSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    collection_name: {
      type: String,
      required: true,
    },
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Services",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const collections = mongoose.model("Collections", collectionsSchema);
export default collections;
