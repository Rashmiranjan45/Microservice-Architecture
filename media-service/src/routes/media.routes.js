import { Router } from "express";
import { getAllMedia, uploadMedia } from "../controller/media.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/upload").post(upload.single("file"), uploadMedia);
router.route("/all-media").get(getAllMedia)

export default router;
