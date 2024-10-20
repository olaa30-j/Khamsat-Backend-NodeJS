import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';
import router from './router/router.js';
import cookieParser from 'cookie-parser';

dotenv.config()

const app = express();

app.use(cors({
    origin: true,
    credentials: true
  }));

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/public', express.static('public'));
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(router)
 
// mongodb setup 
connectDB();

const {PORT} = process.env;
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
})

export default app