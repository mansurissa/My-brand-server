import express from "express";
import {
  comment,
  create,
  deletePost,
  getAllPosts,
  getAllSubscribers,
  getOnePost,
  like,
  subscribe,
  updatePost,
} from "../controllers/superBlog.js";
import { auth } from "../middleware/auth.js";

const blogRouter = express.Router();
blogRouter.route("/").post(auth, create).get(getAllPosts);
blogRouter.route("/subscribe").post(subscribe).get(getAllSubscribers);
blogRouter
  .route("/:id")
  .delete(deletePost)
  .get(getOnePost)
  .patch(updatePost)
  .put(like);
blogRouter.route("/:id/comment").post(comment);

export default blogRouter;
