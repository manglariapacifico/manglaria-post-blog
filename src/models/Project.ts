import { generateSlug } from "@/lib/utils";
import mongoose, { Document } from "mongoose";

export interface IProject extends Document {
  title: string;
  description: string;
  content: string;
  author: mongoose.Schema.Types.ObjectId;
  image: string;
  slug: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      minlength: 5,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 300,
    },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isDeleted: { type: Boolean, default: false },
    image: { type: String },
    slug: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

projectSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = generateSlug(this.title);
  }
  next();
});

export default mongoose.models.Project || mongoose.model<IProject>("Project", projectSchema);