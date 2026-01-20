import { Router } from "express";
import { searchPostController } from "../controller/search.controller.js";

const router = Router();

router.route("/search-post").get(searchPostController);

export default router;
