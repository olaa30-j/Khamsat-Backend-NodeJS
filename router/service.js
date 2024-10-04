import express from 'express'
import { createService, deleteService, filterServices, getAllServices, getServiceById, updateService } from '../controller/service.js';
import { checkRoles, verfiyToken } from '../middleware/auth.js';

const router = express.Router();

// create service
router.post('/', verfiyToken, checkRoles("seller"), createService);

// Get services
router.get('/', getAllServices);

//filter services
router.get('/filter', filterServices);

// Get service
router.get('/:serviceId', getServiceById);

// update service
router.patch('/:serviceId', verfiyToken, checkRoles('admin' ,'seller'), updateService);

// delete service
router.delete('/:serviceId', verfiyToken, checkRoles('admin','seller'), deleteService);

export default router;