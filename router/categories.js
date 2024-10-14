import express from 'express';
import { createCategory, deleteCategory, getAllSubcategories, getCategories, getCategoriesWithSubcategories, getCategory, updateCategory } from '../controller/categories.js';
import { checkRoles, verfiyToken } from '../middleware/auth.js';

const router = express.Router();

// Get all categories
router.get('/', getCategories);

// Get Categories With Subcategories
router.get('/subcategories', getCategoriesWithSubcategories);

// Get category
router.get('/:categoryId', getCategory);

// Get subcategories
router.get('/category/:categoryId', getAllSubcategories);

// Create a category
router.post('/', verfiyToken, checkRoles('admin'), createCategory);

// Update a category
router.patch('/:categoryId', verfiyToken, checkRoles('admin'), updateCategory);

// Delete a category
router.delete('/:categoryId', verfiyToken, checkRoles('admin'), deleteCategory);

export default router;
