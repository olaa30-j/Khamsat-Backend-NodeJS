import express from 'express';
import { createCategory, deleteCategory, getAllSubcategories, getCategories, updateCategory } from '../controller/categories.js';
import { checkRoles, verfiyToken } from '../middleware/auth.js';

const router = express.Router();

// Get all categories
router.get('/', getCategories);

// Get subcategories
router.get('/:categoryId', getAllSubcategories);

// Create a category
router.post('/', verfiyToken, checkRoles('admin'), createCategory);

// Update a category
router.patch('/:categoryId', verfiyToken, checkRoles('admin'), updateCategory);

// Delete a category
router.delete('/:categoryId', verfiyToken, checkRoles('admin'), deleteCategory);

export default router;
