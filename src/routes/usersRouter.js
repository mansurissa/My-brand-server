import express from "express";
import {
  deleteUser,
  getAllUsers,
  getOneUSer,
  login,
  register,
} from "../controllers/usersController.js";

const usersRouter = express.Router();
usersRouter.route("/register").post(register);
usersRouter.route("/login").post(login);
usersRouter.route("/").get(getAllUsers);
usersRouter.route("/:id").delete(deleteUser).get(getOneUSer);

export default usersRouter;
