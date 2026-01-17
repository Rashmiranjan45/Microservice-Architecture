import { User } from "../models/user.models.js";
import logger from "../utils/logger.js";
import { validateLogin, validateRegistration } from "../utils/validation.js";
import { generateToken } from "../utils/generateToken.js";
import { RefreshToken } from "../models/refreshToken.models.js";

//Register User

const registerUser = async (req, res) => {
  logger.info("Registration endpoint hit...");
  try {
    const { error } = validateRegistration(req.body);
    if (error) {
      logger.warn("Validation error", error.details[0].message);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const { username, email, password } = req.body;
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      logger.warn("User already exists");
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    user = new User({ username, email, password });
    await user.save();
    logger.warn("User saved successfully.", user._id);

    const { accessToken, refreshToken } = await generateToken(user);

    console.log(accessToken, refreshToken);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    logger.error("Registration error occured", error);
    res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
};

// Login User

const loginUser = async (req, res) => {
  logger.info("Login endpoint hit...");
  try {
    const { email, password } = req.body;
    const { error } = validateLogin(req.body);
    if (error) {
      logger.warn("Validation error", error.details[0].message);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      logger.warn("User not found.");
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      logger.warn("Invalid credentials.");
      return res.status(400).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const { accessToken, refreshToken } = await generateToken(user);

    return res.status(200).json({
      success: true,
      message: "User LoggedIn successfully",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    logger.error("Login error occured", error);
    res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
};

const createRefreshToken = async (req, res) => {
  logger.info("Refresh Token endpoint hit...");
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      logger.warn("Refresh token missing.");
      return res.status(400).json({
        success: false,
        message: "Refresh token missing.",
      });
    }
    const storedToken = await RefreshToken.findOne({ token: refreshToken });
    if (!storedToken || storedToken.expiresAt < new Date()) {
      logger.warn("Invalid refresh token.");
      return res.status(400).json({
        success: false,
        message: "Invalid refresh token.",
      });
    }
    const user = await User.findById(storedToken.user);
    if (!user) {
      logger.warn("User not found!.");
      return res.status(400).json({
        success: false,
        message: "User not found!.",
      });
    }

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await generateToken(user);

    // delete the old refresh token
    await RefreshToken.deleteOne({ _id: storedToken._id });

    res.json({
      accessToken: newAccessToken,
      refreshToken: new RefreshToken(),
    });
  } catch (error) {
    logger.error("Refresh Token error occured", error);
    res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
};

//logoutUser

const loggedoutUser = async (req, res) => {
  logger.info("Logout endpoint hit...")
  try {
    const {refreshToken} = req.body
    if(!refreshToken){
      logger.warn("Refresh token missing.");
      return res.status(400).json({
        success: false,
        message: "Refresh token missing.",
      });
    }
    await RefreshToken.deleteOne({token:refreshToken})
    logger.info("Refresh token deleted for logout")
    res.json({
      success:true,
      message:"logged out successfully."
    })
  } catch (error) {
    logger.error("Error while logging out user.", error);
    res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
};

export { registerUser, loginUser, loggedoutUser, createRefreshToken };
