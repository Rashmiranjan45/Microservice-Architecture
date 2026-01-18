import logger from "../utils/logger.js";
import { Post } from "../models/post.models.js";
import { validatePost } from "../utils/validation.js";
import { publishEvent } from "../utils/rabbitmq.js";

const invalidateCached = async (req, input) => {
  const cachedKey = `post:${input}`;
  await req.redisClient.del(cachedKey);
  const keys = await req.redisClient.keys("posts:*");
  if (keys.length > 0) {
    await req.redisClient.del(keys);
  }
};

const createPost = async (req, res) => {
  logger.info("Create post endpoint hit");
  try {
    const { content, mediaIds } = req.body;
    const { error } = validatePost(req.body);
    if (error) {
      logger.error("Validation error.", error.details[0].message);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const newlyCreatedPost = new Post({
      user: req.user.userId,
      content,
      mediaIds: mediaIds || [],
    });

    await newlyCreatedPost.save();
    await invalidateCached(req, newlyCreatedPost._id.toString());
    logger.info("Post created successfully.");
    res.status(201).json({
      success: true,
      message: "Post created successfully",
    });
  } catch (error) {
    logger.error("Error while creating post", error);
    res.status(500).json({
      success: false,
      message: "Error while creating post",
    });
  }
};

const getAllPost = async (req, res) => {
  logger.info("get allpost endpoint hit");
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const startIndex = (page - 1) * limit;

    const cacheKey = `posts:${page}:${limit}`;
    const cachedPosts = await req.redisClient.get(cacheKey);
    if (cachedPosts) {
      return res.json(JSON.parse(cachedPosts));
    }

    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    const totalNoOfPosts = await Post.countDocuments();

    const result = {
      posts,
      currentPage: page,
      totalPages: Math.ceil(totalNoOfPosts / limit),
      totalPosts: totalNoOfPosts,
    };

    await req.redisClient.setex(cacheKey, 300, JSON.stringify(result));

    res.json(result);
  } catch (error) {
    logger.error("Error while fetching post", error);
    res.status(500).json({
      success: false,
      message: "Error while fetching post",
    });
  }
};
const getSinglePost = async (req, res) => {
  logger.info("Create post endpoint hit");
  try {
    const id = req.params.postId;

    const cachekey = `post:${id}`;
    const cachedPost = await req.redisClient.get(cachekey);
    if (cachedPost) {
      return res.json(JSON.parse(cachedPost));
    }

    const post = await Post.findById(id);
    if (!post) {
      logger.warn("Post not found!");
      return res.status(400).json({
        success: false,
        message: "Post not found!",
      });
    }

    await req.redisClient.setex(cachekey, 3600, JSON.stringify(post));

    res.json(post);
  } catch (error) {
    logger.error("Error while fetching single post", error);
    res.status(500).json({
      success: false,
      message: "Error while fetching single post",
    });
  }
};

const deletePost = async (req, res) => {
  logger.info("Delete post endpoint hit");
  try {
    const id = req.params.postId;
    const post = await Post.findOneAndDelete({
      _id: id,
      user: req.user.userId,
    });

    if (!post) {
      logger.warn("Post not found!");
      return res.status(400).json({
        success: false,
        message: "Post not found!",
      });
    }

    //publish post delete method ->
    await publishEvent("post.deleted", {
      postId: post._id.toString(),
      userId: req.user.userId,
      mediaIds: post.mediaIds,
    });

    await invalidateCached(req, req.params.id);
    res.json({
      message: "Post deleted successfully.",
      success: true,
    });
  } catch (error) {
    logger.error("Error while deleting post", error);
    res.status(500).json({
      success: false,
      message: "Error while deleting post",
    });
  }
};

export { createPost, getAllPost, getSinglePost, deletePost };
