import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface ITodo extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;

  title: string;
  description?: string;
  completed: boolean;

  createdAt: Date;
  updatedAt: Date;
}

//? Todo schema
const todoSchema = new Schema<ITodo>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"]
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    completed: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Todo: Model<ITodo> =
  mongoose.models.Todo || mongoose.model<ITodo>("Todo", todoSchema);

export default Todo;
