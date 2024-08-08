const express = require('express');
let router = express.Router();
const{createMessage} = require('../controllers/messageCont');

router.post("/",createMessage);





module.exports = router;