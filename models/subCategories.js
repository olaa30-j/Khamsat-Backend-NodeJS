import mongoose from "mongoose";

const NestedSubcategorySchema = new mongoose.Schema({
  title: {
    ar: {
      type: String,
      required: true,
    },
    en: {
      type: String,
      required: true,
    },
  },
});

const SubCategoriesSchema = new mongoose.Schema({
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categories",
    required: true,
  },
  title: {
    ar: {
      type: String,
      required: true,
    },
    en: {
      type: String,
      required: true,
    },
  },
  subcategories: {
    type: [NestedSubcategorySchema],
    required: true,
  },
});

const SubCategories = mongoose.model("SubCategories", SubCategoriesSchema);
export default SubCategories;
