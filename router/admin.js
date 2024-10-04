import express from 'express';
import {
    createAdmin,
    loginAdmin,
    findAdminById,
    updateAdmin,
    deleteAdmin,
    getProfile
} from '../controller/admin.js'; 
import { checkRoles, verfiyToken } from '../middleware/auth.js';
const router = express.Router();

// Route to create an admin
router.post('/', createAdmin);

// Route to log in an admin
router.post('/login', loginAdmin);

// Route to find a logged in admin
router.get('/profile', verfiyToken , checkRoles('admin'),  getProfile);

// Route to find an admin by ID
router.get('/:adminId', verfiyToken , checkRoles('admin'),  findAdminById);

// Route to update an admin
router.patch('/', verfiyToken , checkRoles('admin'), updateAdmin);

// Route to delete an admin
router.delete('/:adminId', verfiyToken , checkRoles('admin'), deleteAdmin);

export default router;
