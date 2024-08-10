import express from 'express'
import { createService, deleteService, getAllServices, getServiceById, updateService } from '../controller/service.js';

const router = express.Router();

// create service
router.post('/:userId', createService);

// create service
router.get('/', getAllServices);

// create service
router.get('/service/:serviceId', getServiceById);

// update service
router.patch('/:serviceId', updateService);

// delete service
router.delete('/:serviceId', deleteService);

export default router;