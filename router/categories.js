import express from 'express';
import { createCategory, deleteCategory, getCategories, updateCategory } from '../controller/categories.js';

const router = express.Router();

// Get all categories
router.get('/', getCategories);

// Create a category
router.post('/', createCategory);

// Update a category
router.patch('/:categoryId', updateCategory);

// Delete a category
router.delete('/category/:categoryId', deleteCategory);

export default router;
