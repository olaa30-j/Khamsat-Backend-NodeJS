import express from 'express';
import { createCategory, deleteCategory, getCategories, updateCategory } from '../controller/categories.js';
import { checkRoles, verfiyToken } from '../middleware/auth.js';

const router = express.Router();

// Get all categories
router.get('/', getCategories);

// Create a category
router.post('/', createCategory);

// Update a category
router.patch('/:categoryId', verfiyToken, checkRoles('admin'), updateCategory);

// Delete a category
router.delete('/category/:categoryId', verfiyToken, checkRoles('admin'), deleteCategory);

export default router;
