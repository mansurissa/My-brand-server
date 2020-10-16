import express from "express";
import jwt from "jsonwebtoken";
import {
  deleteUser,
  getAllUsers,
  getOneUSer,
  login,
  register,
} from "../controllers/usersController.js";
import { oAuth } from "../middleware/auth.js";

const usersRouter = express.Router();
usersRouter.route("/register").post(register);
usersRouter.route("/login").post(login);
usersRouter.route("/").get(getAllUsers);
usersRouter.route("/:id").delete(deleteUser).get(getOneUSer);
usersRouter.get("/login/:provider", oAuth.main);
usersRouter.get("/auth/:provider/callback", oAuth.callback, (req, res) => {
  const token = jwt.sign({ ...req.user }, process.env.JWT_KEY);
  res.status(200).json(token);
});

export default usersRouter;
