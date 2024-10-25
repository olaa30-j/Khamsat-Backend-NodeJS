import categoriesModel from '../models/categories.js';
import SubCategories from '../models/subCategories.js';

// //////////////////////////////////////////////////////////////////////////////////////////////////// // 
// Get a categories

const createQuery = (queryPrams)=> {
    let query = {}
    if (queryPrams.categoryName) {
        query['$or'] = [
                { 'name.ar': queryPrams.categoryName },
                { 'name.en': queryPrams.categoryName }
        ]
    }     
    return query
}
export const getCategories = async (req, res) => {
    
    try{
        const query = createQuery(req.query)        
        const categories = await categoriesModel.find(query);
        res.status(200).json({message: 'Get all categories successfully', categories})
    }catch(error){
        res.status(500).json({message: error.message})
    }
}

// //////////////////////////////////////////////////////////////////////////////////////////////////// // 
// Get all category categories with all subcategories
export const getCategoriesWithSubcategories = async (req, res) => {
    try{
        const categories = await categoriesModel.aggregate([
            {
                $lookup: {
                    from: 'subcategories', 
                    localField: '_id', 
                    foreignField: 'category_id', 
                    as: 'subcategories'
                  }
            }
        ]);
        res.status(200).json({message: 'Get all categories successfully', categories})
    }catch(error){
        res.status(500).json({message: error.message})
    }
}
// //////////////////////////////////////////////////////////////////////////////////////////////////// // 
// Get a category
export const getCategory = async (req, res) => {
    const {categoryId} = req.params

    try{
        const category = await categoriesModel.findById(categoryId);

        res.status(200).json({message: 'Get category successfully', category})
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

        const subcategories = await SubCategories.find({ category_id: categoryId });
        res.status(200).json({ subcategories });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// //////////////////////////////////////////////////////////////////////////////////////////////////// //
// Create a category
export const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const category = await categoriesModel.create({ name, description });
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
        const  {description}  = req.body;
        const updatedCategory = await categoriesModel.findByIdAndUpdate(
            categoryId,
            {
                $set:{
                    name,
                    description
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
