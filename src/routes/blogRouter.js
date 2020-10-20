import express from 'express';
import {
  comment,
  create,
  deletePost,
  getAllPosts,
  getAllSubscribers,
  getAllCommentsOnPost,
  getOnePost,
  like,
  oneComment,
  subscribe,
  updatePost,
} from '../controllers/superBlog.js';
// import { auth } from '../middleware/authx.js';

const blogRouter = express.Router();
blogRouter.route('/').post(create).get(getAllPosts);
blogRouter.route('/subscribe').post(subscribe).get(getAllSubscribers);
blogRouter
  .route('/:id')
  .delete(deletePost)
  .get(getOnePost)
  .patch(updatePost)
  .put(like);
blogRouter.route('/:id/comment').post(comment);
blogRouter.route('/:id/allComments').get(getAllCommentsOnPost);
blogRouter.route('/comments/:id').get(oneComment);

export default blogRouter;
