import mongoose,{Schema,model} from "mongoose";

let messageSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      minLength: 5,
    },

    archived: {
      type: Boolean,
      default: false,
    },

    attachments: {
      type: Array,
      required: false,
    },

    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },

    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },

    receiver_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },

    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Orders",
      required: false,
    },
  },

  { timestamps: true }
);

let messageModel = model("Message", messageSchema);
export default messageModel;