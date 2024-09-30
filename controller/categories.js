import categories from '../models/categories.js';
import SubCategories from '../models/subCategories.js';

// //////////////////////////////////////////////////////////////////////////////////////////////////// // 
// Get a category
export const getCategories = async (req, res) => {
    try{
        const categories = await categories.find();
        res.status(200).json({message: 'Get all categories successfully', categories})
    }catch(error){
        res.status(500).json({message: error.message})
    }
}

// //////////////////////////////////////////////////////////////////////////////////////////////////// //
// Create a category
export const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const category = await categories.create({ name });
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
        const updatedCategory = await categories.findByIdAndUpdate(
            categoryId,
            {
                $set:{
                    name
                }
            }
        );
        res.status(201).json({ message: 'Category created successfully', updatedCategory });
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

        const category = await categories.findByIdAndDelete(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const allSubcategories = await SubCategories.find({category});
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
