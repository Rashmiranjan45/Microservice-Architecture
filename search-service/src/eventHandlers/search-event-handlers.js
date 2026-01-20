import { SearchPost } from "../models/search.models.js";
import logger from "../utils/logger.js";

const handlePostCreated = async (event) => {
  const { postId, userId, content, createdAt } = event;
  try {
    const newSearchPost = new SearchPost({
      postId,
      userId,
      content,
      createdAt,
    });
    await newSearchPost.save();
    logger.info(`SearchPost created from :${postId} , ${newSearchPost._id}`);
  } catch (error) {
    logger.error("Error while SearchPost creation", error);
  }
};

async function handlePostDeleted(event) {
  const { postId } = event;
  try {
    await SearchPost.findOneAndDelete(postId);
    logger.info(`SearchPost deleted from :${postId}`);
  } catch (error) {
    logger.error("Error while post deletion in search model", error);
  }
}

export { handlePostCreated, handlePostDeleted };
