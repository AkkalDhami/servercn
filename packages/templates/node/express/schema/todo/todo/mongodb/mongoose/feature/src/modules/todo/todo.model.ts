import mongoose, { Document, Model, Schema, Types } from "mongoose";

/**
 * Todo Interface
 * Defines the structure of a Todo document
 */
export interface ITodo extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;

  title: string;
  description?: string;
  completed: boolean;

  createdAt: Date;
  updatedAt: Date;
}

/**
 * Todo Schema definition
 */
const todoSchema = new Schema<ITodo>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: [true, "User ID is required"],
      index: true // Indexed for faster user-specific queries
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [255, "Title cannot be longer than 255 characters"]
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description cannot be longer than 2000 characters"]
    },
    completed: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt
  }
);

// Performance Indexes
todoSchema.index({ userId: 1, completed: 1 });
todoSchema.index({ createdAt: -1 });

const Todo: Model<ITodo> =
  mongoose.models.Todo || mongoose.model<ITodo>("Todo", todoSchema);

export default Todo;
