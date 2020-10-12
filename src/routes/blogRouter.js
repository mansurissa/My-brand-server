import express from "express";
import {
  create,
  deletePost,
  getAllPosts,
  getOnePost,
  updatePost,
} from "../controllers/superBlog.js";

const blogRouter = express.Router();
blogRouter.route("/").post(create).get(getAllPosts);
blogRouter.route("/:id").delete(deletePost).get(getOnePost).patch(updatePost);

export default blogRouter;
