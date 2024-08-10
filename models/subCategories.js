import mongoose from 'mongoose';

const SubcategorySchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    }
});

const SubCategoriesSchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categories',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    subcategories: {
        type: [SubcategorySchema], 
        required: true
    }
});

const SubCategories = mongoose.model('SubCategories', SubCategoriesSchema);
export default SubCategories;
