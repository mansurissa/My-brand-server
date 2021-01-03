import errorRes from '../helpers/errorHandler.js';
import successHandler from '../helpers/success.js';
import Post from '../models/blogModel.js';
import uploader from '../config/cloudinary.js';
import Comment from '../models/comments.js';
import Subscriber from '../models/subscribers.js';

export const createPost = async (req, res) => {
  const { title, body } = req.body;
  await Post.findOne({ title: `${title}` }, (err, result) => {
    if (result) {
      errorRes(res, 500, 'The title alresdy exist');
    }
  });

  try {
    if (!title || title.length < 3) {
      return errorRes(res, 500, ' please fill title correctly');
    }
    if (!body || body.length < 10) {
      return errorRes(res, 500, ' please fill body correctly');
    }

    const post = await Post.create({
      title,
      body,
      imageUrl: '',
      imageId: '',
      likes: 0,
      commentsCount: 0,
      views: 0,
      time: Date.now(),
    });
    if (req.files) {
      const tmp = req.files.image.tempFilePath;
      const result = await uploader.upload(tmp, (_, result) => result);

      post.imageUrl = result.url;
      post.imageId = result.public_id;
      post.save();
    }
    return successHandler(res, 201, 'new post created successfully', post);
  } catch (error) {
    return errorRes(res, 500, 'Failed to create a post', error);
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ time: -1 });
    return successHandler(res, 200, 'successfully read all posts', {
      postsCount: posts.length,
      posts,
    });
  } catch (error) {
    return errorRes(res, 500, 'there was error getting all posts', error);
  }
};

export const getOnePost = async (req, res) => {
  try {
    const onePost = await Post.findById(req.params.id);
    onePost.views += 1;
    await onePost.save();
    return successHandler(res, 200, 'post got successfully', onePost);
  } catch (error) {
    return errorRes(res, 404, 'not found on posts list', error);
  }
};

export const deletePost = async (req, res) => {
  try {
    const foundPost = await Post.findById(req.params.id);
    if (!foundPost) return errorRes(res, 404, 'cant find that post');

    if (foundPost.imageId) await uploader.destroy(foundPost.imageId);
    await Post.deleteOne({ _id: foundPost._id });
    return successHandler(res, 200, 'Deleted post successfully');
  } catch (error) {
    return errorRes(res, 500, 'There was error deleting post', error);
  }
};

export const updatePost = async (req, res) => {
  try {
    let result;
    if (req.files) {
      const tmp = req.files.image.tempFilePath;
      result = await uploader.upload(tmp, (_, result) => result);
      req.body.imageUrl = result.url;
      req.body.imageId = result.public_id;
    }
    const updatedPost = await Post.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true },
    );
    if (!updatedPost) {
      return errorRes(res, 404, " Can't find that post on list");
    }
    return successHandler(res, 201, 'Updated post successfully', updatedPost);
  } catch (error) {
    return errorRes(res, 500, 'There was a problem updating post', error);
  }
};

export const comment = async (req, res) => {
  const { name, email, message } = req.body;
  try {
    if (!message) errorRes(res, 500, 'Some filed are not field');
    const comment = await Comment.create({
      name,
      email,
      message,
      time: Date.now(),
    });
    const post = await Post.findById(req.params.id);
    if (!post) errorRes(res, 404, 'no such post found');
    post.comments.push(comment._id);
    post.commentsCount += 1;
    await post.save();

    return successHandler(res, 201, 'successfully commented', comment);
  } catch (error) {
    return errorRes(res, 500, 'there was error commenting');
  }
};

export const getAllCommentsOnPost = async (req, res) => {
  try {
    const foundPost = await Post.findById(req.params.id)
      .populate('comments')
      .sort({ time: -1 });
    return successHandler(
      res,
      200,
      'successfully fetched all comments',
      foundPost.comments,
    );
  } catch (error) {
    return errorRes(res, 500, 'there was error fetching all comments');
  }
};
export const oneComment = async (req, res) => {
  try {
    const oneCm = await Comment.findById(req.params.id);
    return successHandler(res, 200, 'this is one comment', oneCm);
  } catch (error) {
    return errorRes(res, 500, 'failed to fetch that');
  }
};

export const like = async (req, res) => {
  try {
    const foundUser = await Post.findById(req.params.id);
    if (!foundUser) errorRes(res, 404, 'cant find that post');
    foundUser.likes += 1;
    await foundUser.save();
    return successHandler(res, 200, 'successfully liked');
  } catch (error) {
    return errorRes(res, 500, 'there was error while liking');
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
    return successHandler(res, 200, 'fetched all subscriber successfully', {
      subsCount: allSubs.length,
      subscribers: allSubs,
    });
  } catch (error) {
    return errorRes(res, 500, 'Failed while fetching all subscribers');
  }
};
