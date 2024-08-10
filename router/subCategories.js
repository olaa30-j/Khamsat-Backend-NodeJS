import express from 'express';
import {
    createSubcategories,
    deleteSubcategory,
    getAllSubcategories,
    deleteSubcategories,
    getSubcategoriesById,
    getSubcategoryById,
    updateSubcategories,
    updateSubcategoryById
} from "../controller/subCategories.js";

const router = express.Router();

// Create a subcategories
router.post('/', createSubcategories);

// Get all subcategories
router.get('/:categoryId', getAllSubcategories);

// Get subcategories By Id
router.get('/subcategories/:subcategoriesId', getSubcategoriesById);

// Get subcategory By Id
router.get('/subcategory/:subcategoriesId/:subcategoryId', getSubcategoryById);

// Update a subcategory
router.patch('/:subcategoryId', updateSubcategories);

// Update a subcategory
router.patch('/subcategory/:subcategoriesId/:subcategoryId', updateSubcategoryById);

// Delete a subcategories
router.delete('/:subcategoryId', deleteSubcategories);

// Delete a subcategories
router.delete('/subcategory/:subcategoriesId/:subcategoryId', deleteSubcategory);

export default router;
