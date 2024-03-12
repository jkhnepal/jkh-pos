import { Request } from "express";
import cloudinary from "../../config/cloudinaryConfig";
import { uploadSingleFile } from "./uploadSingleFile";

export const handleUpdateImage = async (req: Request, item: any) => {
  if (!req.file) {
    return item.image;
  }

  let url;
  try {
    // Upload new image
    url = await uploadSingleFile(req.file);

    // Delete previous image
    const publicId = item.image.split("/").slice(-2).join("/").split(".")[0];
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error updating image:", error);
    throw new Error("Failed to update image");
  }

  return url;
};
