import express from 'express'
import { createService, deleteService, getAllServices, getServiceById, updateService } from '../controller/service.js';
import { checkRoles, verfiyToken } from '../middleware/auth.js';

const router = express.Router();

// create service
router.post('/:userId', createService);

// create service
router.get('/', getAllServices);

// create service
router.get('/service/:serviceId', getServiceById);

// update service
router.patch('/:serviceId', verfiyToken, checkRoles('admin' ,'seller'), updateService);

// delete service
router.delete('/:serviceId', verfiyToken, checkRoles('seller'), deleteService);

export default router;