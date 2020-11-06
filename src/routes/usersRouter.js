import express from 'express';
import {
  deleteUser,
  getAllUsers,
  getOneUSer,
  login,
  register,
} from '../controllers/usersController.js';

const router = express.Router();
router.route('/register').post(register);
router.route('/login').post(login);
router.route('/').get(getAllUsers);
router.route('/:id').delete(deleteUser).get(getOneUSer);

export default router;
