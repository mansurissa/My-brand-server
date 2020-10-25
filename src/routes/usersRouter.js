import express from 'express';
import jwt from 'jsonwebtoken';
import {
  deleteUser,
  getAllUsers,
  getOneUSer,
  login,
  register,
} from '../controllers/usersController.js';
import { oAuth } from '../middleware/auth.js';

const router = express.Router();
router.route('/register').post(register);
router.route('/login').post(login);
router.route('/').get(getAllUsers);
router.route('/:id').delete(deleteUser).get(getOneUSer);
router.get('/login/:provider', oAuth.main);
router.get('/auth/:provider/callback', oAuth.callback, (req, res) => {
  const token = jwt.sign({ ...req.user }, process.env.JWT_KEY);
  res.status(200).json(token);
});

export default router;
