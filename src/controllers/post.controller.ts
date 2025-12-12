import { Request, Response } from "express";
import mongoose from "mongoose";

import {
  createPostService,
  getAllPostsService,
  getPostsByUserService,
  getPostByIdService,
  deletePostService,
} from "../services/post.service.js";

interface AuthRequest extends Request {
  user?: { id: string };
  body: {
    title: string;
    image: string;
    coords: { longitude: number; latitude: number };
  };
}

interface AuthRequestWithParams extends Request<{ id: string }> {
  user?: { id: string };
}

export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const { title, image, coords } = req.body;

    const post = await createPostService({
      title,
      image,
      user: new mongoose.Types.ObjectId(req.user.id),
      location: {
        type: "Point",
        coordinates: [coords.longitude, coords.latitude],
      },
    });

    res.status(201).json(post);
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Error creating post" });
  }
};

export const getAllPosts = async (_req: Request, res: Response) => {
  try {
    const posts = await getAllPostsService();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching posts" });
  }
};

export const getMyPosts = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const posts = await getPostsByUserService(req.user.id);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user posts" });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const post = await getPostByIdService(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Error fetching post" });
  }
};

export const deletePost = async (req: AuthRequestWithParams, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const deleted = await deletePostService(req.params.id, req.user.id);

    if (!deleted)
      return res
        .status(404)
        .json({ message: "Post not found or not authorized" });

    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting post" });
  }
};
