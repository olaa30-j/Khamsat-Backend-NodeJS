import express from 'express'
import { createReplies, createReview, deleteReply, deleteReview, getReviews, updateReplies, updateReview } from '../controller/reviews.js';
import { checkRoles, verfiyToken } from '../middleware/auth.js';

const router = express.Router();

// get reviews
router.get('/', getReviews);

// create review
router.post('/', createReview);

// update review
router.patch('/:userId/:reviewId',  verfiyToken, checkRoles('seller', 'buyer'), updateReview);

// delete review
router.delete('/:userId/:reviewId',  verfiyToken, checkRoles('seller', 'buyer'), deleteReview);

// ////////////////////////////////////////////// //
// create reply
router.patch('/reply/:userId/:reviewId',  verfiyToken, checkRoles('seller', 'buyer'), createReplies);

// update reply
router.patch('/reply/update/:userId/:reviewId',  verfiyToken, checkRoles('seller', 'buyer'), updateReplies);

// delete reply
router.patch('/reply/delete/:userId/:reviewId',  verfiyToken, checkRoles('seller', 'buyer'), deleteReply);
export default router;