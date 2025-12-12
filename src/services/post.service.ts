import Post, { IPost } from "../models/post.model.js";

export const createPostService = async (data: Partial<IPost>) => {
  return await Post.create(data);
};

export const getAllPostsService = async () => {
  return await Post.find()
    .populate("user", "username")
    .sort({ createdAt: -1 });
};

export const getPostsByUserService = async (userId: string) => {
  return await Post.find({ user: userId })
    .populate("user", "username")
    .sort({ createdAt: -1 });
};

export const getPostByIdService = async (id: string) => {
  return await Post.findById(id).populate("user", "username");
};

export const deletePostService = async (id: string, userId: string) => {
  return await Post.findOneAndDelete({ _id: id, user: userId });
};
