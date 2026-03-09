import { model, Schema, Types } from "mongoose";

export interface IComment extends Document {
  _id: Types.ObjectId;

  post: Types.ObjectId;
  author: Types.ObjectId;
  content: string;
  parentComment?: Types.ObjectId;

  likes: Types.ObjectId[];

  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true
    }, // Blog post reference

    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }, // Comment author

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
      minlength: 1
    }, // Comment text

    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ], // List of users who liked the comment

    parentComment: {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    } // For nested replies
  },
  { timestamps: true }
);

//? index for query performance,
commentSchema.index({ post: 1 });
commentSchema.index({ author: 1 });
commentSchema.index({ parentComment: 1 });

const Comment = model<IComment>("Comment", commentSchema);

export default Comment;
