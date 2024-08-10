import mongoose from 'mongoose';
import Service from './service.js';

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


// ////////////////////////////////////////////////////////////////////////////////////////////// //
// save
reviewSchema.pre('save', async function(next) {
    if (this.isNew || this.isModified('overallRating')) {
        console.log("save"+this.serviceId);

        try {
            const service = await Service.findById(this.serviceId);
            if (!service) {
                return next(new Error('Service not found'));
            }

            const serviceReviews = await Review.find({ serviceId: this.serviceId });
            
            service.serviceCard.totalReviewers = serviceReviews.length;
            service.serviceCard.totalRated = serviceReviews.length > 0
                ? serviceReviews.reduce((acc, current) => acc + (current.overallRating || 0), 0) / serviceReviews.length
                : 0; 

            await service.save();

            console.log(serviceReviews.length);
            
            next();
        } catch (err) {
            return next(err);
        }
    } else {
        next(); 
    }
});

// update
reviewSchema.pre('findOneAndUpdate', async function (next) {
    try {
        const update = this.getUpdate();
        const query = this.getQuery();
        const reviewId = query._id ? query._id : null;

        if (update.$set && update.$set.overallRating !== undefined) {
            if (!reviewId) {
                return next(new Error('Review ID is missing'));
            }

            const review = await Review.findById(reviewId);
            if (!review) {
                return next(new Error('Review not found'));
            }

            const service = await Service.findById(review.serviceId);
            if (!service) {
                return next(new Error('Service not found'));
            }

            const serviceReviews = await Review.find({ serviceId: review.serviceId });

            service.serviceCard.totalReviewers = serviceReviews.length;
            service.serviceCard.totalRated = serviceReviews.reduce((acc, current) => {
                return acc + (current.overallRating || 0);
            }, 0) / serviceReviews.length;

            await service.save();
        }

        next();
    } catch (err) {
        return next(err);
    }
});

// remove
reviewSchema.pre('remove', async function (next) {
    try {
        const service = await Service.findById(this.serviceId);
        if (!service) {
            return next(new Error('Service not found'));
        }

        const serviceReviews = await Review.find({ serviceId: this.serviceId });

        service.serviceCard.totalReviewers = serviceReviews.length;
        service.serviceCard.totalRated = serviceReviews.length > 0
            ? serviceReviews.reduce((acc, current) => acc + (current.overallRating || 0), 0) / serviceReviews.length
            : 0;

        await service.save();
        next();
    } catch (err) {
        return next(err);
    }
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
