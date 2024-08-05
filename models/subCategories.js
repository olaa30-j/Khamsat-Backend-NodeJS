import mongoose from 'mongoose'

const subCategoriesSchema = new mongoose.Schema({
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categories',
        required: true
    },
    title: { 
        type: String, 
        required: true 
    },
    subCategories:{
        type: [String],
        required: true
    }
})

const subCategories = mongoose.model('SubCategories', subCategoriesSchema);
export default subCategories;