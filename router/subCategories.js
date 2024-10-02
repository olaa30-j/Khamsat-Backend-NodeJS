import express from 'express';
import {
    createSubcategories,
    deleteSubcategory,
    deleteSubcategories,
    getSubcategoriesById,
    getSubcategoryById,
    updateSubcategories,
    updateSubcategoryById
} from "../controller/subCategories.js";
import { verfiyToken, checkRoles } from '../middleware/auth.js';

const router = express.Router();

// Create a subcategories
router.post('/', verfiyToken, checkRoles('admin'), createSubcategories);

// Get subcategories By Id
router.get('/:subcategoriesId', getSubcategoriesById);

// Get subcategory By Id
router.get('/:subcategoriesId/:subcategoryId', getSubcategoryById);

// Update a subcategory
router.patch('/:subcategoryId', verfiyToken, checkRoles('admin'), updateSubcategories);

// Update a subcategory
router.patch('/:subcategoriesId/:subcategoryId', verfiyToken, checkRoles('admin'), updateSubcategoryById);

// Delete a subcategories
router.delete('/:subcategoryId', verfiyToken, checkRoles('admin'), deleteSubcategories);

// Delete a subcategories
router.delete('/:subcategoriesId/:subcategoryId', verfiyToken, checkRoles('admin'),deleteSubcategory);

export default router;
