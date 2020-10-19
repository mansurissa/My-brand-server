import errorRes from '../helpers/errorHandler.js';
import successHandler from '../helpers/success.js';
import Post from '../models/blogModel.js';
import uploader from '../config/cloudinary.js';
import Comment from '../models/comments.js';
import Subscriber from '../models/subscribers.js';

export const create = async (req, res) => {
  const { title, body } = req.body;
  const tmp = req.files.image.tempFilePath;

  try {
    if (!title || !body) {
      errorRes(res, 500, ' some fileds are not filled correctly');
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
      author: req.user.id,
    });
    successHandler(res, 201, 'new post created successfully', post);
  } catch (error) {
    console.log(error);
    errorRes(res, 500, 'Failed to create a post');
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    successHandler(res, 200, 'successfully read all posts', {
      postsCount: posts.length,
      posts,
    });
  } catch (error) {
    errorRes(res, 500, 'there was error getting all posts');
  }
};

export const getOnePost = async (req, res) => {
  try {
    const onePost = await Post.findById(req.params.id);
    onePost.views += 1;
    await onePost.save();
    return successHandler(res, 200, 'post got successfully', onePost);
  } catch (error) {
    console.log(error);
    return errorRes(res, 404, 'not found on posts list');
  }
};

export const deletePost = async (req, res) => {
  const id = req.params._id;
  try {
    const foundPost = await Post.findOne(id);
    if (!foundPost) return errorRes(res, 404, 'cant find that post');

    await foundPost.deleteOne();
    if (foundPost.imageId) await uploader.destroy(foundPost.imageId);
    return successHandler(res, 200, 'Deleted post successfully');
  } catch (error) {
    return errorRes(res, 500, 'There was error deleting post');
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

    return successHandler(res, 201, 'Updated post successfully', updatedPost);
  } catch (error) {
    console.log(error);
    return errorRes(res, 500, 'There was a problem updating post');
  }
};

export const comment = async (req, res) => {
  const { name, email, message } = req.body;
  try {
    if (!email || !message) errorRes(res, 500, 'Some filed are not field');
    const comment = await Comment.create({
      name,
      email,
      message,
    });
    const post = await Post.findById(req.params.id);
    if (!post) errorRes(res, 404, 'no such post found');
    post.comments.push(comment._id);
    post.commentsCount += 1;
    await post.save();

    successHandler(res, 201, 'successfully commented', comment);
  } catch (error) {
    console.log(error);
    errorRes(res, 500, 'there was error commenting');
  }
};

export const getAllCommentsOnPost = async (req, res) => {
  try {
    const foundPost = await Post.findById(req.params.id).populate('comments');
    successHandler(
      res,
      200,
      'successfully fetched all comments',
      foundPost.comments,
    );
  } catch (error) {
    console.log(error);
    errorRes(res, 500, 'there was error fetching all comments');
  }
};
export const oneComment = async (req, res) => {
  try {
    const oneCm = await Comment.findById(req.params.id);
    successHandler(res, 200, 'this is one comment', oneCm);
  } catch (error) {
    console.log(error);
    errorRes(res, 500, 'failed to fetch that');
  }
};

export const like = async (req, res) => {
  try {
    const foundUser = await Post.findById(req.params.id);
    if (!foundUser) errorRes(res, 404, 'cant find that post');
    foundUser.likes += 1;
    await foundUser.save();
    successHandler(res, 200, 'successfully liked');
  } catch (error) {
    console.log(error);
    errorRes(res, 500, 'there was error while liking');
  }
};

export const subscribe = async (req, res) => {
  try {
    const subscriber = await Subscriber.create({
      email: req.body.email,
      time: Date.now(),
    });
    successHandler(res, 201, 'Subscribed successfully', subscriber);
  } catch (error) {
    errorRes(res, 500, 'There was error while subscribing');
  }
};
export const getAllSubscribers = async (req, res) => {
  try {
    const allSubs = await Subscriber.find();
    successHandler(res, 200, 'fetched all subscriber successfully', {
      subsCount: allSubs.length,
      subscribers: allSubs,
    });
  } catch (error) {
    console.log(error);
    errorRes(res, 500, 'Failed while fetching all subscribers');
  }
};
