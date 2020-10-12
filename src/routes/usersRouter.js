import express from "express";
import {
  deleteUser,
  getAllUsers,
  login,
  register,
} from "../controllers/usersController";

const usersRouter = express.Router();
usersRouter.route("/register").post(register);
usersRouter.route("/login").post(login);
usersRouter.route("/").get(getAllUsers);
usersRouter.route("/:id").get(deleteUser);

export default usersRouter;
