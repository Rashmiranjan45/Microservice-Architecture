import logger from "../utils/logger.js";
import { SearchPost } from "../models/search.models.js";

const searchPostController = async (req, res) => {
  logger.info("Search endpoint hit...");

  try {
    const { query } = req.query;
    const results = await SearchPost.find(
      {
        $text: { $search: query },
      },
      { score: { $meta: "textScore" } },
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(10);

    res.json(results);
  } catch (error) {
    logger.error("Error while Searching", error);
    res.status(500).json({
      success: false,
      message: "Error while Searching",
    });
  }
};

export { searchPostController };
