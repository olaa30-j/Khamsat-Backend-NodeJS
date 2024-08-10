import express from 'express'
import { createReplies, createReview, deleteReply, deleteReview, updateReplies, updateReview } from '../controller/reviews.js';

const router = express.Router();

// create review
router.post('/:userId', createReview);

// update review
router.patch('/:userId/:reviewId', updateReview);

// delete review
router.delete('/:userId/:reviewId', deleteReview);

// ////////////////////////////////////////////// //
// create reply
router.patch('/reply/:userId/:reviewId', createReplies);

// update reply
router.patch('/reply/update/:userId/:reviewId', updateReplies);

// delete reply
router.patch('/reply/delete/:userId/:reviewId', deleteReply);
export default router;