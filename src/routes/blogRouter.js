import express from 'express';
import {
  comment,
  deletePost,
  getAllPosts,
  getAllSubscribers,
  getAllCommentsOnPost,
  getOnePost,
  like,
  oneComment,
  subscribe,
  updatePost,
  createPost,
} from '../controllers/superBlog.js';
// import { auth } from '../middleware/authx.js';

const router = express.Router();
router.route('/').post(createPost).get(getAllPosts);
router.route('/subscribe').post(subscribe).get(getAllSubscribers);
router
  .route('/:id')

  .delete(deletePost)
  .get(getOnePost)
  .patch(updatePost)
  .put(like);
router.route('/:id/comment').post(comment);
router.route('/:id/allComments').get(getAllCommentsOnPost);
router.route('/comments/:id').get(oneComment);

export default router;
