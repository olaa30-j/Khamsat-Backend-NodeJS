import express from 'express'
import { createService, deleteService, filterServices, getAllServices, getServiceById, getUserServices, updateService } from '../controller/service.js';
import { checkRoles, verfiyToken } from '../middleware/auth.js';
import upload from '../middleware/multer.config.js';

const router = express.Router();

// create service
router.post('/', upload.fields([{ name: 'singleFile', maxCount: 1 }, { name: 'files', maxCount: 5 }]), createService);

// Get services
router.get('/', getAllServices);

//filter services
router.get('/filter', filterServices);

// Get service
router.get('/:serviceId', getServiceById);

// Get service
router.get('/:userId', getUserServices);

// update service
router.patch('/:serviceId', verfiyToken, checkRoles('admin' ,'seller'), updateService);

// delete service
router.delete('/:serviceId', verfiyToken, checkRoles('admin','seller'), deleteService);

export default router;