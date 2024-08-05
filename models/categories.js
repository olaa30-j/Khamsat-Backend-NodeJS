import mongoose from 'mongoose'

const categoriesSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    }
})

const categories = mongoose.model('Categories', categoriesSchema);
export default categories;