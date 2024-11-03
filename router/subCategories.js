import express from 'express';
import {
    createSubcategories,
    deleteSubcategory,
    deleteSubcategories,
    getSubcategoriesById,
    getSubcategoryById,
    updateSubcategories,
    updateSubcategoryById,
    getSubcategories
} from "../controller/subCategories.js";
import {checkRoles, authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// Create a subcategories
router.post('/', authenticateUser, checkRoles('admin'), createSubcategories);

// Get subcategories By Id
router.get('/dashboard', authenticateUser, checkRoles('admin'), getSubcategories);

// Get subcategories By Id
router.get('/:subcategoriesId', getSubcategoriesById);

// Get subcategory By Id
router.get('/:subcategoriesId/:subcategoryId', getSubcategoryById);

// Update a subcategory
router.patch('/:subcategoryId', authenticateUser, checkRoles('admin'), updateSubcategories);

// Update a subcategory
router.patch('/:subcategoriesId/:subcategoryId', authenticateUser, checkRoles('admin'), updateSubcategoryById);

// Delete a subcategories
router.delete('/:subcategoryId', authenticateUser, checkRoles('admin'), deleteSubcategories);

// Delete a subcategories
router.delete('/:subcategoriesId/:subcategoryId', authenticateUser, checkRoles('admin'),deleteSubcategory);

export default router;
