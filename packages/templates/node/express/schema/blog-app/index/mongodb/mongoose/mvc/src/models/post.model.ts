import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { IFile } from "./user.model";

const POST_STATUSES = ["draft", "published", "archived"] as const;

type PostStatus = (typeof POST_STATUSES)[number];

export interface IPost extends Document {
  _id: Types.ObjectId;

  title: string;
  slug: string;
  content: string;

  excerpt?: string;
  author: Types.ObjectId;
  category?: Types.ObjectId;
  tags?: string[];
  featuredImage: IFile | null;

  views: number;
  likes: Types.ObjectId[];
  likeCount: number;

  status: PostStatus;
  publishedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: true
    }, // Blog post title

    slug: {
      type: String,
      required: true
    }, // SEO-friendly URL slug

    content: {
      type: String,
      required: true
    }, // Main blog content

    excerpt: {
      type: String
    }, // Short summary

    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }, // Reference to User

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category"
    }, // Reference to category

    tags: {
      type: [String],
      default: []
    }, // List of tags

    featuredImage: {
      public_id: String,
      url: String,
      size: Number
    }, // Blog cover image URL

    views: {
      type: Number,
      default: 0
    }, // View count

    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ], // Users who liked the post

    likeCount: {
      type: Number,
      default: 0
    }, // Cached number of likes

    status: {
      type: String,
      enum: POST_STATUSES,
      default: "draft"
    }, // Publication status

    publishedAt: {
      type: Date
    } // Date when published
  },
  {
    timestamps: true
  }
);

//? indexes for efficient searching and filtering
postSchema.index({ title: "text", content: "text" });
postSchema.index({ author: 1, slug: 1 }, { unique: true });

postSchema.index({ category: 1 }); // Efficient retrieval of posts by category
postSchema.index({ createdAt: -1 });

const Post: Model<IPost> =
  mongoose.models.Post || mongoose.model<IPost>("Post", postSchema);

export default Post;
