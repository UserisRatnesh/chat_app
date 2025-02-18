import express from "express";
import {
  signup,
  login,
  logout,
  updateProfile,
} from "../controller/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

// NOTE: Update profile picture
router.put("/update-profile", protectRoute, updateProfile);

export default router;
