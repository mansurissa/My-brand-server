import errorRes from "../helpers/errorHandler.js";
import successHandler from "../helpers/success.js";
import Post from "../models/blogModel.js";
import { uploader } from "../config/cloudinary.js";

export const create = async (req, res) => {
  const { title, body } = req.body;
  const tmp = req.files.image.tempFilePath;

  try {
    if (!title || !body) {
      errorRes(res, 500, " some fileds are not filled correctly");
    }
    const result = await uploader.upload(tmp, (_, result) => result);

    const post = await Post.create({
      title,
      body,
      imageUrl: result.url,
      imageId: result.public_id,
      likes: 0,
      commentsCount: 0,
      views: 0,
      time: Date.now(),
    });
    successHandler(res, 201, "new post created successfully", post);
  } catch (error) {
    console.log(error);
    errorRes(res, 500, "Failed to create a post");
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    await successHandler(res, 200, "successfully read all posts", {
      postsCount: posts.length,
      posts,
    });
  } catch (error) {
    errorRes(res, 500, "there was error getting all posts");
  }
};

export const getOnePost = async (req, res) => {
  try {
    const onePost = await Post.findById(req.params.id);
    successHandler(res, 200, "post got successfully", onePost);
  } catch (error) {
    console.log(error);
    errorRes(res, 404, "not found on posts list");
  }
};

export const deletePost = async (req, res) => {
  const id = req.params._id;
  try {
    const foundPost = await Post.findOne(id);
    if (!foundPost) return errorRes(res, 404, "cant find that post");

    await foundPost.deleteOne();
    if (foundPost.imageId) await uploader.destroy(foundPost.imageId);
    successHandler(res, 200, "Deleted post successfully");
  } catch (error) {
    errorRes(res, 500, "There was error deleting post");
  }
};

export const updatePost = async (req, res) => {
  try {
    const tmp = req.files.image.tempFilePath;

    const foundPost = await Post.findOne({ _id: req.params.id });
    if (!foundPost) {
      return errorRes(res, 404, " Can't find that post on list");
    }
    if (req.files) await uploader.destroy(foundPost.imageId);
    const result = await uploader.upload(tmp, (_, result) => result);
    const updatedPost = await foundPost.updateOne({
      ...req.body,
      imageId: result.public_id,
      imageUrl: result.url,
    });

    successHandler(res, 201, "Updated post successfully", updatedPost);
  } catch (error) {
    console.log(error);
    errorRes(res, 500, "There was a problem updating post");
  }
};
