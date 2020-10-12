import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
// import passport from "passport";
// import jwtStrategy from "./config/passport";
import blogRouter from "./routes/blogRouter.js";
import usersRouter from "./routes/usersRouter.js";
import connectDb from "./config/database.js";
import errorRes from "./helpers/errorHandler.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
// passport.use(passport.initialize());
// passport.use(jwtStrategy);
connectDb();

app.use("/blog", blogRouter);
app.use("/users", usersRouter);

app.use((req, res) => {
  errorRes(res, 404, "Route not found");
});

const port = process.env.PORT;
app.listen(port, console.log("Server is running on port:", port));
