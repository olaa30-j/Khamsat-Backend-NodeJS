import categories from '../models/categories.js';
import SubCategories from '../models/subCategories.js';

// //////////////////////////////////////////////////////////////////////////////////////////////////// //
// Create a subcategories
export const createSubcategories = async (req, res) => {
    try {
        const {
            title,
            category_id,
            subcategories
        } = req.body;


        if (!category_id || !subcategories || !title) {
            return res.status(400).json({ message: "Category ID and Subcategories are required." })
        }

        const category = await categories.findById(category_id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const newSubCategories = new SubCategories({
            category: category._id,
            title,
            subcategories: subcategories.map(sub => ({
                name: sub.name
            }))
        });

        await newSubCategories.save();


        res.status(201).json({ message: 'Subcategory created successfully', newSubCategories });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// //////////////////////////////////////////////////////////////////////////////////////////////////// //
// Get all subcategories
export const getAllSubcategories = async (req, res) => {
    try {
        const { categoryId } = req.params
        const category = await categories.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const allSubcategories = await SubCategories.find({ category: categoryId });
        res.status(200).json({ subcategoryTitle: allSubcategories });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// //////////////////////////////////////////////////////////////////////////////////////////////////// //
// Get subcategories by id
export const getSubcategoriesById = async (req, res) => {
    try {
        const { subcategoriesId } = req.params
        const subcategories = await SubCategories.findById(subcategoriesId);
        if (!subcategories) {
            return res.status(404).json({ message: 'Subcategories not found' });
        }

        res.status(200).json({ subcategories: subcategories });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// //////////////////////////////////////////////////////////////////////////////////////////////////// //
// Get subcategory by id
export const getSubcategoryById = async (req, res) => {
    try {
        const { subcategoriesId, subcategoryId } = req.params
        const subcategories = await SubCategories.findById(subcategoriesId);
        if (!subcategories) {
            return res.status(404).json({ message: 'subcategories not found' });
        }

        const subcategory = subcategories.subcategories.find((subcategory) => subcategory._id == subcategoryId);
        res.status(200).json({ subcategory });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// //////////////////////////////////////////////////////////////////////////////////////////////////// //
// Update a subcategories || Add new subcategory
export const updateSubcategories = async (req, res) => {
    try {
        const { subcategoryId } = req.params;
        const {
            title,
            subcategories
        } = req.body;

        const updatedData = {};

        if (title) {
            updatedData.$set = { title };
        }

        if (subcategories) {
            updatedData.$push = { subcategories: subcategories.map(subcategory => ({ name: subcategory.name })) }
        }

        const updatedSubcategory = await SubCategories.findByIdAndUpdate(
            { _id: subcategoryId },
            updatedData,
            { new: true, runValidators: true }
        )

        res.status(200).json({ message: 'Subcategory updated successfully', updatedSubcategory });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// //////////////////////////////////////////////////////////////////////////////////////////////////// //
// Update a subcategory
export const updateSubcategoryById = async (req, res) => {
    const { subcategoryId, subcategoriesId } = req.params;
    const { name } = req.body;

    try {
        const updatedSubcategory = await SubCategories.findOneAndUpdate(
            { _id: subcategoriesId, 'subcategories._id': subcategoryId },
            {
                $set: {
                    'subcategories.$.name': name
                }
            },
            { new: true }
        );
        
        if (!updatedSubcategory) {
            return res.status(404).json({ message: "Subcategory not found" });
        }

        res.status(200).json({ message: "Subcategory updated successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}



// //////////////////////////////////////////////////////////////////////////////////////////////////// //
// Delete a subcategories
export const deleteSubcategories = async (req, res) => {
    try {
        const { subcategoryId } = req.params;

        if (!subcategoryId) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }

        await SubCategories.findByIdAndDelete(subcategoryId);

        res.status(200).json({ message: 'Subcategory deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// //////////////////////////////////////////////////////////////////////////////////////////////////// //
// Delete a subcategory
export const deleteSubcategory = async (req, res) => {
    try {
        const { subcategoriesId, subcategoryId } = req.params;

        const subcategories = await SubCategories.findById(subcategoriesId);
        if (!subcategories || !subcategoryId) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }

        const updatedSubcategories = subcategories.subcategories.filter(sub => sub._id != subcategoryId);

        subcategories.subcategories = updatedSubcategories;
        await subcategories.save();

        res.status(200).json({ message: 'Subcategory deleted successfully', subcategories });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

