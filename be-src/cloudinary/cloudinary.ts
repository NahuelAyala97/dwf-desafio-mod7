import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dyqkgso1o",
  api_key: "948823894364925",
  //process.env.cloudinary_key
  api_secret: process.env.CLOUDINARY_KEY,
});

export { cloudinary };
