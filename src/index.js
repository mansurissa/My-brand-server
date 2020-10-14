import "dotenv/config.js";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import upload from "express-fileupload";
import blogRouter from "./routes/blogRouter.js";
import usersRouter from "./routes/usersRouter.js";
import connectDb from "./config/database.js";
import errorRes from "./helpers/errorHandler.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(upload({ useTempFiles: true }));
app.use(cors());
app.use(morgan("dev"));

connectDb();

// app.post("/blog/upload", async (req, res) => {
//   try {
//     const tmp = req.files.image.tempFilePath;
//     const result = await uploader.upload(`blog/${tmp}`, (_, result) => result);

//     console.log(result);
//     res.status(200).json({ success: true, result });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, error });
//   }
// });
// app.post("/blog/upload", (req, res) => {
//   const { image } = req.files;
//    image.mv(path.resolve(__dirname, "/upload"), (err, result) => {
//     if (err) {
//       console.log(err);
//       return res.status(500).json({ message: "failed to upload", error: err });
//     }
//     return res.status(200).json({ message: "uploaded", path: result });
//   });
// });
app.use("/blog", blogRouter);
app.use("/users", usersRouter);

app.use((req, res) => {
  errorRes(res, 404, "Route not found");
});

const port = process.env.PORT;
app.listen(port, console.log("Server is running on port:", port));
