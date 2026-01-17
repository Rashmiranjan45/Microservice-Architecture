import mongoose, { Schema } from "mongoose";
import argon2 from "argon2";
import logger from "../utils/logger.js";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      this.password = await argon2.hash(this.password);
    }
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.comparePassword = async function (password) {
  try {
    return await argon2.verify(this.password, password);
  } catch (error) {
    logger.error("Error while comparing password", error);
    throw error;
  }
};

userSchema.index({ username: "text" });

export const User = mongoose.model("User", userSchema);
