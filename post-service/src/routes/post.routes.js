import { Router } from "express";
import {
  createPost,
  deletePost,
  getAllPost,
  getSinglePost,
} from "../controller/post.controller.js";

const router = Router();

router.route("/create-post").post(createPost);
router.route("/get-posts").get(getAllPost);
router.route("/:postId").get(getSinglePost);
router.route("/:postId").delete(deletePost);

export default router;
