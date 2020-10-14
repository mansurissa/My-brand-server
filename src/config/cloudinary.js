import cloudinary from "cloudinary";

cloudinary.v2.config(process.env.CLOUDINARY_URL);

export const { uploader } = cloudinary.v2;
