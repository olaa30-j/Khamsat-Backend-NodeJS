import{Router} from 'express';
let router = Router();

import {createNotification,getAllNotifications,getNotificationById,editNotificationById,deleteNotificationById} from '../controller/notifications.js';

router.post('/',createNotification);

router.get('/',getAllNotifications);
router.get('/:id',getNotificationById);

router.patch('/:id',editNotificationById);

router.delete('/:id',deleteNotificationById);




export default router;