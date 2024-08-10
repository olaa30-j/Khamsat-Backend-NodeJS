import{Router} from 'express';
let router = Router();

import {createNotification,getAllNotifications,getNotificationById,editNotificationById,deleteNotificationById} from '../controllers/notificatCont.js';

router.post('/',createNotification);

router.get('/',getAllNotifications);
router.get('/:id',getNotificationById);

router.patch('/:id',editNotificationById);

router.delete('/:id',deleteNotificationById);




export default router;