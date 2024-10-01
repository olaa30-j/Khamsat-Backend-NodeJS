import categoriesModel from '../models/categories.js';
import SubCategories from '../models/subCategories.js';

// //////////////////////////////////////////////////////////////////////////////////////////////////// // 
// Get a category
export const getCategories = async (req, res) => {
    try{
        const categories = await categoriesModel.find();
        res.status(200).json({message: 'Get all categories successfully', categories})
    }catch(error){
        res.status(500).json({message: error.message})
    }
}

// //////////////////////////////////////////////////////////////////////////////////////////////////// //
// Get all subcategories
export const getAllSubcategories = async (req, res) => {
    try {
        const { categoryId } = req.params
        const category = await categoriesModel.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const allSubcategories = await SubCategories.find({ category_id: categoryId });
        res.status(200).json({ subcategoryTitle: allSubcategories });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// //////////////////////////////////////////////////////////////////////////////////////////////////// //
// Create a category
export const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const category = await categoriesModel.create({ name });
        res.status(201).json({ message: 'Category created successfully', category });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// //////////////////////////////////////////////////////////////////////////////////////////////////// //
// Update a category
export const updateCategory = async (req, res) => {
    try {
        const {categoryId} = req.params;
        const  {name}  = req.body;
        const updatedCategory = await categoriesModel.findByIdAndUpdate(
            categoryId,
            {
                $set:{
                    name
                }
            }, {new: true}
        );
        res.status(201).json({ message: 'Category updated successfully', updatedCategory });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// //////////////////////////////////////////////////////////////////////////////////////////////////// //
// Delete a category
export const deleteCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        console.log(categoryId);

        const category = await categoriesModel.findByIdAndDelete(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const allSubcategories = await SubCategories.find({category_id: category});
        const subcategories = [...allSubcategories]

        console.log(category, allSubcategories, subcategories);

        if (subcategories) {
            for (const subcategory of subcategories) {
                await  SubCategories.findByIdAndDelete({_id: subcategory._id})
            }
        }

        res.status(200).json({ message: 'Subcategory deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
