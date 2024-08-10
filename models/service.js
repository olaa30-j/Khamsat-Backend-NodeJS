import mongoose from "mongoose";

const serviceCardSchema = new mongoose.Schema({
    totalRated: {
        type: Number,
        default: 0
    },
    totalReviewers: {
        type: Number,
        default: 0
    },
    totalBuyer: {
        type: Number,
        default: 0
    },
    activeOrders: { 
        type: Number,
        required: true,
        default: 0
    },
    averageResponseTime: {
        type: Number,
        required: true,
        default: 0
    }
}, { _id: false });

const serviceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categories',
        required: true
    },
    subcategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategories',
        required: true
    },
    price: {
        type: Number,
        default: '5',
        required: true
    },
    images: {
        type: [String],
        required: true
    },
    keyword:{
        type:[String],
        default:[],
        required:true
    },
    deliveryTime: {
        type: Number,
        required: true
    },
    serviceCard:{
        type: serviceCardSchema,
        default: {}
    }
},
    {
        timestamps: true
    });

const ServiceSchema = mongoose.model('Service', serviceSchema);
export default ServiceSchema;