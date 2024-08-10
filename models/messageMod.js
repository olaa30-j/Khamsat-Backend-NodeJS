import mongoose,{Schema,model} from "mongoose";

let messageSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      minLength: 5,
      maxLength: 100,
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
      type: mongoose.Schema.ObjectId,
    },

    receiver_id: {
      type: mongoose.Schema.ObjectId,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },

  {
    timestamp: true,
  }
);

messageSchema.pre("save", function (next) {
  this.createdAt = Date.now();
  next();
});

let messageModel = model("Message", messageSchema);
export default messageModel;