import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';
import router from './router/router.js';

dotenv.config()

const app = express();
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/static', express.static('static'));
app.use(router)

// mongodb setup 
connectDB();

const {PORT} = process.env;
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
})
