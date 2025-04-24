import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema({
  name_en: { type: String, required: true },
  name_fr: { type: String, required: true },
  name_ar: { type: String, required: true },
  icon: { type: String, required: true }
});

const categorySchema = new mongoose.Schema(
  {
    name_en: { type: String, required: true },
    name_fr: { type: String, required: true },
    name_ar: { type: String, required: true },
    description_en: { type: String, required: true },
    description_fr: { type: String, required: true },
    description_ar: { type: String, required: true },
    icon: { type: String, required: true },
    bgColor: { type: String, required: true },
    subCategories: { type: [subCategorySchema], required: false }
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);
export default Category;
