import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    userName: {
        type: String,
        min:(4, 'minimum 4 characters'),
        max: (10, 'maximum 10 characters'),
        required: true
    }, 
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        default: 'admin'
    }
})


const AdminSchema = mongoose.model('Admin', adminSchema);
export default AdminSchema;