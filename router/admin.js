import express from 'express';
import {
    createAdmin,
    loginAdmin,
    findAdminById,
    updateAdmin,
    deleteAdmin
} from '../controller/admin.js'; 
import { verfiyToken } from '../middleware/auth.js';
const router = express.Router();

// Route to create an admin
router.post('/', createAdmin);

// Route to log in an admin
router.post('/login', loginAdmin);

// Route to find an admin by ID
router.get('/admin/:adminId', verfiyToken,  findAdminById);

// Route to update an admin
router.patch('/', verfiyToken, updateAdmin);

// Route to delete an admin
router.delete('/:adminId', verfiyToken, deleteAdmin);

export default router;
