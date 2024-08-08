import { Router } from 'express';
let router = Router();
import { createMessage } from '../controllers/messageCont.js';

router.post("/",createMessage);





export default router;