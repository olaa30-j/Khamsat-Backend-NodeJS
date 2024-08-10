import express from 'express';
import mongoose from 'mongoose';
import dotenv  from 'dotenv';

const app = express();
dotenv.config();
app.use(express.json());


import notificationRoutes from './routes/notificatRoute.js';

app.use('/notification',notificationRoutes);



mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("connected to Khamsat DB successfully");

}).catch((err)=>{
    console.log(err)
});



app.listen(process.env.PORT,()=>{
    console.log('connected successfully to port');
})


