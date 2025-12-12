import { Router } from "express";
import {
  createPost,
  getAllPosts,
  getMyPosts,
  getPostById,
  deletePost,
} from "../controllers/post.controller.js";
import { auth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/user/me", auth, getMyPosts);

router.get("/", getAllPosts);
router.post("/", auth, createPost);


router.get("/:id", getPostById);
router.delete("/:id", auth, deletePost);

export default router;
