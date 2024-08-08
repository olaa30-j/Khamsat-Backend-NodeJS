const express = require ('express');
const mongoose = require ('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const dbLink = process.env.MONGO_URL;
const dbPort = process.env.PORT;

const app = express(); 

app.use(express.json());

const messageRoutes = require('./routes/messageRoute');
app.use('/message',messageRoutes);

mongoose.connect(dbLink).then(()=>{
    console.log("connected to khamsat DB successfully")
}).catch((err)=>{
    console.log(err)
})

app.listen(dbPort,()=>{
    console.log("app listenting to port")
})