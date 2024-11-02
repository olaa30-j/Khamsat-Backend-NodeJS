import express from 'express'
import { createService, deleteService, filterServices, getServiceById, getServices, getUserServices, getUsersServices, updateService, updateServiceStatus } from '../controller/service.js';
import { authenticateUser, checkRoles, verfiyToken } from '../middleware/auth.js';
import upload from '../middleware/multer.config.js';

const router = express.Router();

// create service
router.post('/', authenticateUser, checkRoles('seller'), upload.fields([{ name: 'images', maxCount: 7}]), createService);

// Get Users services
router.get('/', getUsersServices);

// Get All services
router.get('/dashboard', authenticateUser, checkRoles('admin'),getServices);

//filter services
router.get('/filter', filterServices);

// Get service
router.get('/:serviceId', getServiceById);

// Get service
router.get('/userservices/:userId', getUserServices);

// update service
router.patch('/:serviceId', verfiyToken, checkRoles('seller'), updateService);

// update service status
router.patch('/dashboard/:serviceId', authenticateUser, checkRoles('admin'), updateServiceStatus);

// delete service
router.delete('/:serviceId', deleteService);

export default router;