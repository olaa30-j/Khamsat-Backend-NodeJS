import Review from "../models/reviews.js";
import Service from "../models/service.js";

// //////////////////////////////////////////////////////////////////////////////////////////////////////// //
// Update Service
export const UpdateService = async (serviceId) => {
    try {
        const service = await Service.findById(serviceId);
        if (!service) {
            throw new Error('Service not found');
        }

        const serviceReviews = await Review.find({serviceId:serviceId});
        service.serviceCard.totalReviewers = serviceReviews.length;
        service.serviceCard.totalRated = serviceReviews.length > 0
            ? serviceReviews.reduce((acc, current) => acc + (current.overallRating || 0), 0) / serviceReviews.length
            : 0;

        console.log(service.serviceCard);
        await service.save();
    } catch (err) {
        console.error('Error updating service:', err);
        throw err;
    }
};
// //////////////////////////////////////////////////////////////////////////////////////////////////////// //
// Get Reviews
export const getReviews = async (req, res) => {
    const { serviceId } = req.params;

    try {
        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ message: 'No Service found' });
        }

        const serviceReviews = await Review.find({ serviceId }).select('-userId -orderId');

        res.status(200).json({ message: "All Reviews found successfully", serviceReviews });
    } catch (err) {
        console.error('Error retrieving reviews:', err);
        res.status(500).json({ message: 'An error occurred while retrieving reviews', error: err.message });
    }
};


// //////////////////////////////////////////////////////////////////////////////////////////////////////// //
// Create Reply
export const createReplies = async (req, res) => {
    const { reviewId, userId } = req.params;
    const { replyText } = req.body;

    try {
        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        const updatedReview = await Review.findByIdAndUpdate(
            reviewId,
            {
                $push: {
                    replies: {
                        userId: userId,
                        replyText: replyText
                    }
                }
            },
            { new: true }
        );

        return res.status(201).json({ message: "Reply created successfully", updatedReview });
    } catch (err) {
        console.error('Error creating reply:', err);
        return res.status(500).json({ message: "Server failed to create reply" });
    }
};

// //////////////////////////////////////////////////////////////////////////////////////////////////////// //
// Create Review
export const createReview = async (req, res) => {

    const {
        userId,
        qualityOfService,
        communication,
        deliveryPunctuality,
        reviewText,
        serviceId,
        orderId
    } = req.body;

    if (!reviewText || !serviceId || !orderId) {
        return res.status(400).json({ message: "Missing required fields." });
    }

    try {
        const qService = qualityOfService != null ? Number(qualityOfService) : 0;
        const comm = communication != null ? Number(communication) : 0;
        const delPunct = deliveryPunctuality != null ? Number(deliveryPunctuality) : 0;

        if (
            qService < 0 || qService > 5 ||
            comm < 0 || comm > 5 ||
            delPunct < 0 || delPunct > 5
        ) {
            return res.status(400).json({ message: "Ratings must be between 0 and 5." });
        }

        const totalRating = (qService + comm + delPunct) / 3;
        
        const newReview = await Review.create({
            userId,
            serviceId,
            orderId,
            qualityOfService: qService,
            communication: comm,
            deliveryPunctuality: delPunct,
            overallRating: totalRating,
            reviewText,
        });

        // Ensure UpdateService is defined and properly imported
        try {
            await UpdateService(serviceId);
        } catch (updateError) {
            console.error('Error updating service:', updateError);
            return res.status(500).json({ message: "Review created, but service update failed." });
        }

        return res.status(201).json({ message: "Review created successfully", newReview });
    } catch (err) {
        console.error('Error creating review:', err);
        return res.status(500).json({ message: "Server failed to create review" });
    }
};

// //////////////////////////////////////////////////////////////////////////////////////////////////////// //
// Update Reply
export const updateReplies = async (req, res) => {
    const { reviewId, userId } = req.params;
    const { replyId, replyText } = req.body;

    try {
        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        const checkUser = review.replies.map((reply)=>{
            return reply.userId.toString() == userId
        })

        if(!checkUser){
            res.status(403).json({ message: "You are not authorized to update this reply"})   
        }

        const updatedReview = await Review.findOneAndUpdate(
            { _id: reviewId, 'replies._id': replyId },
            {
                $set: {
                    'replies.$.replyText': replyText
                }
            },
            { new: true }
        );

        if (!updatedReview) {
            return res.status(404).json({ message: "Reply not found" });
        }

        return res.status(200).json({ message: "Reply updated successfully", updatedReview });
    } catch (err) {
        console.error('Error updating reply:', err);
        return res.status(500).json({ message: "Server failed to update reply" });
    }
};

// //////////////////////////////////////////////////////////////////////////////////////////////////////// //
// Update Review
export const updateReview = async (req, res) => {
    const { userId, reviewId } = req.params;
    const {
        qualityOfService,
        communication,
        deliveryPunctuality,
        reviewText
    } = req.body;

    try {
        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        const newQualityOfService = qualityOfService !== undefined ? qualityOfService : review.qualityOfService;
        const newCommunication = communication !== undefined ? communication : review.communication;
        const newDeliveryPunctuality = deliveryPunctuality !== undefined ? deliveryPunctuality : review.deliveryPunctuality;

        const totalRating = (newQualityOfService + newCommunication + newDeliveryPunctuality) / 3;

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        if(review.userId.toString() == userId){
            const updatedReview = await Review.findOneAndUpdate(
                { _id: reviewId },
                {
                    $set: {
                        qualityOfService: newQualityOfService,
                        communication: newCommunication,
                        deliveryPunctuality: newDeliveryPunctuality,
                        overallRating: totalRating,
                        reviewText: reviewText,
                    }
                },
                { new: true }
            );
    
            if (!updatedReview) {
                return res.status(404).json({ message: "Review not found" });
            }    

            await UpdateService(review.serviceId);
            res.status(200).json({ message: "Review updated successfully", updatedReview });
        }

    } catch (err) {
        console.error('Error updating reply:', err);
        res.status(500).json({ message: "Server failed to update review" });
    }
};

// //////////////////////////////////////////////////////////////////////////////////////////////////////// //
// Delete Review
export const deleteReview = async (req, res) => {
    const { reviewId } = req.params;
    try {
        const reviewDeleted = await Review.findByIdAndDelete(reviewId);
        if (!reviewDeleted) {
            return res.status(404).json({ message: "Review not found" });
        }

        await UpdateService(reviewDeleted.serviceId);
        res.status(200).json({ message: "Review deleted successfully", reviewDeleted });
    } catch (err) {
        res.status(500).json({ message: "Server failed to deleted review" });
    }
}

// //////////////////////////////////////////////////////////////////////////////////////////////////////// //
// Delete Reply

export const deleteReply = async (req, res) => {
    const { reviewId, userId } = req.params;
    const { replyId } = req.body;

    try {
        const review = await Review.findById(reviewId);
        const checkUser = review.replies.map((reply)=> reply.userId.toString() == userId)
        if(!checkUser){
            res.status(403).json({ message: "You are not authorized to update this reply"})   
        }

        const updatedReplies = review.replies.filter(reply => {
            return reply._id.toString() !== replyId
        });

        review.replies = updatedReplies;
        await review.save();

        res.status(200).json({ message: "Review deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server failed to delete reply" });
    }
}
