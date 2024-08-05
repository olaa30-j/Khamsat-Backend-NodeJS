import express from 'express';

const app = express();


app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})