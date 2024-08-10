import {Router}from 'express';
let router = Router();

import {createMessage,getMessage,getMessageById,editMessageById,deleteMessageById} from '../controller/messages.js';

router.post("/",createMessage);

router.get("/",getMessage);
router.get("/:id",getMessageById)

router.patch("/:id",editMessageById)

router.delete("/:id",deleteMessageById)

export default router;