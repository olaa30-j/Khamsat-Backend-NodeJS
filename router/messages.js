import {Router}from 'express';
let router = Router();

import {createMessage,getMessage,getMessagesByOrder, getMessageById,editMessageById,deleteMessageById} from '../controller/messages.js';

router.post("/",createMessage);

router.get("/", getMessage);
router.get("/order/:orderId", getMessagesByOrder);
router.get("/:id",getMessageById)

router.patch("/:id",editMessageById)

router.delete("/:id",deleteMessageById)

export default router;