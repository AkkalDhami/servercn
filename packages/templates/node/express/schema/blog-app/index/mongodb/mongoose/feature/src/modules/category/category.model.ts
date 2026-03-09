import mongoose, { model, Schema } from "mongoose";

export interface ICategory extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true
    }, // Category name

    slug: {
      type: String,
      required: true,
      unique: true
    }, // URL-friendly slug

    description: {
      type: String
    } // Category description
  },
  { timestamps: true }
);

//? Index for quick lookup by slug
categorySchema.index({ slug: 1, name: 1 }, { unique: true });

const Category = model<ICategory>("Category", categorySchema);

export default Category;
