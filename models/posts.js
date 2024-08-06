import mongoose from "mongoose";

const commentsSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    body: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const postsSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    category: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
    },
    comments: [commentsSchema],
  },
  { timestamps: true }
);

const posts = mongoose.model("Posts", postsSchema);
export default posts;
