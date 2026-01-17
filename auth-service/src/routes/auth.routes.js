import { Router } from "express";
import {
  createRefreshToken,
  loggedoutUser,
  loginUser,
  registerUser,
} from "../controller/auth.controller.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/refresh-token").post(createRefreshToken);
router.route("/logout").post(loggedoutUser);

export default router;
