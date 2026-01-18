import { Media } from "../models/media.models.js";
import { uploadMediaToCloudinary } from "../utils/cloudinary.js";
import logger from "../utils/logger.js";

const uploadMedia = async (req, res) => {
  logger.info("starting media upload.");
  try {
    if (!req.file) {
      logger.error("File not found please add a file and try again!");
      return res.status(400).json({
        success: false,
        message: "File not found please add a file and try again!",
      });
    }
    const { originalname, mimetype, buffer } = req.file;
    const userId = req.user.userId;
    logger.info("file details", originalname, mimetype);
    logger.info("Uploading to cloudinary...");

    const cloudinaryMediaUpload = await uploadMediaToCloudinary(req.file);

    const newlyCreatedMedia = new Media({
      publicId: cloudinaryMediaUpload.public_id,
      originalname,
      mimetype,
      url: cloudinaryMediaUpload.secure_url,
      userId,
    });
    await newlyCreatedMedia.save();

    res.status(201).json({
      success: true,
      mediaId: newlyCreatedMedia._id,
      url: newlyCreatedMedia.url,
      message: "Media upload is successfully",
    });
  } catch (error) {
    logger.error("Error while uploading media", error);
    return res.status(500).json({
      success: false,
      message: "Error while uploading media",
    });
  }
};

const getAllMedia = async (req, res) => {
  try {
    const result = await Media.find({});
    res.json({
      result,
    });
  } catch (error) {
    logger.error("Error fetching media.");
    res.status(500).json({
      success: false,
      message: "Error fetching media.",
    });
  }
};

export { uploadMedia, getAllMedia };
