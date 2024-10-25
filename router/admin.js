import express from 'express';
import {
    createAdmin,
    loginAdmin,
    findAdminById,
    updateAdmin,
    deleteAdmin,
    getProfile
} from '../controller/admin.js'; 
import { authenticateUser, checkRoles, verfiyToken } from '../middleware/auth.js';
import upload from '../middleware/multer.config.js';

const router = express.Router();

// Route to create an admin
router.post('/', authenticateUser, upload.single('image'),  createAdmin);

// Route to log in an admin
router.post('/login', loginAdmin);

// Route to find a logged in admin
router.get('/profile', authenticateUser , checkRoles('admin'),  getProfile);

// Route to find an admin by ID
router.get('/:adminId', authenticateUser , checkRoles('admin'),  findAdminById);

// Route to update an admin
router.patch('/', authenticateUser , checkRoles('admin'), updateAdmin);

// Route to delete an admin
router.delete('/:adminId', authenticateUser , checkRoles('admin'), deleteAdmin);

export default router;
