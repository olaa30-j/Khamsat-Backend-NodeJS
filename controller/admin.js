import mongoose from "mongoose";

const adminSchema = new mongoose.schema({
    name: {
        type: String,
        minLength:(4, 'minimum 4 characters'),
        maxLength: (20, 'maximum 10 characters'),
        required: true
    },
})