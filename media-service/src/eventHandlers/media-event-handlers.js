import { Media } from "../models/media.models.js";
import { deleteMediaFromCloudinary } from "../utils/cloudinary.js";
import logger from "../utils/logger.js";

export const handlePostDeleted = async (event) => {
  const { postId, mediaIds } = event;
  try {
    const mediaToDelete = await Media.find({ _id: { $in: mediaIds } });
    for (const media of mediaToDelete) {
      await deleteMediaFromCloudinary(media.publicId);
      await Media.findByIdAndDelete(media._id);
      logger.infor(
        `Deleted media ${media._id} associated with this deleted post ${postId}`,
      );
    }
    logger.info(`Processed deletion of media for post id ${postId}`);
  } catch (error) {
    logger.error("Error while media deletion", error);
  }
};
