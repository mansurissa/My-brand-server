import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  title: { type: String, required: true, unique: true },
  imageUrl: { type: String },
  imageId: { type: String },
  body: { type: String, required: true },
  time: { type: String },
  likes: { type: Number },
  commentsCount: { type: Number },
  views: { type: Number },
  comments: [{ type: mongoose.Types.ObjectId, ref: "Comment" }],
  author: { type: mongoose.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.model("Post", postSchema);
