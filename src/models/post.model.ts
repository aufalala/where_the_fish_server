import mongoose, { Document, Schema, Model } from "mongoose";
import { IUser } from "./user.model.js";

export interface IPost extends Document {
  title: string;
  image: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  user: IUser["_id"];
  createdAt: Date;
  updatedAt: Date;
}

const postSchema: Schema<IPost> = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

postSchema.index({ location: "2dsphere" });

const Post: Model<IPost> = mongoose.model<IPost>("Post", postSchema);

export default Post;
