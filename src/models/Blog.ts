import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    tag: { type: String, required: true },
    imageUrl: { type: String, required: true }
  },
  { timestamps: true }
);

export const BlogModel = mongoose.models.Blog ?? mongoose.model('Blog', blogSchema);
