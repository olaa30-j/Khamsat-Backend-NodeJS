import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    replyText: {
        type: String,
        minLength: [10, 'Minimum characters are 10'],
        maxLength: [400, 'Maximum characters are 400'],
        required: true
    }
}, {
    timestamps: true
});

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Orders',
        required: true
    },
    qualityOfService: {
        type: Number,
        min: 0,
        max: 5
    },
    communication: {
        type: Number,
        min: 0,
        max: 5
    },
    deliveryPunctuality: {
        type: Number,
        min: 0,
        max: 5
    },
    overallRating: {
        type: Number,
        default: 0
    },
    reviewText: {
        type: String,
        minLength: [10, 'Minimum characters are 10'],
        maxLength: [400, 'Maximum characters are 400'],
        required: true
    },
    replies: {
        type: [replySchema],
        default: []
    }
},{
    timestamps: true
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
