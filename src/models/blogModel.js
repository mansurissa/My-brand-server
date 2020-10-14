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
});

export default mongoose.model("Post", postSchema);
