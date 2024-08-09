import express from 'express' ;
import mongoose from 'mongoose';
import dotenv from 'dotenv';

const app = express(); 
dotenv.config();
app.use(express.json());

const dbLink = process.env.MONGO_URL;
const dbPort = process.env.PORT;


import messageRoutes from './routes/messageRoute.js';
app.use('/message',messageRoutes);


mongoose.connect(dbLink).then(()=>{
    console.log("connected to khamsat DB successfully")
}).catch((err)=>{
    console.log(err)
})


app.listen(dbPort,()=>{
    console.log("app listenting to port")
})