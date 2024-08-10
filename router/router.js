import express from "express";
const router = express.Router();
import collections from "./collections.js";
import carts from "./carts.js";
import posts from "./posts.js";
import orders from "./orders.js";
import users from "./users.js";
import notifications from "./notifications.js"
import messages from "./messages.js"
import { verfiyToken, checkRoles } from "../middleware/auth.js";
// routers
import subCategoriesRouter from './subCategories.js';
import categoriesRouter from './categories.js';
import servicesRouter from './service.js';
import reviewsRouter from './reviews.js';
import upgradesRouter from './upgrade.js';
import adminRouter from './admin.js';
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from './../swagger.json'  with {type: "json"};

router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));

router.use("/collections", verfiyToken, collections);
router.use("/carts", verfiyToken, checkRoles("user"), carts);
router.use("/posts", posts);
router.use("/orders", verfiyToken, orders);
router.use("/users", users);
router.use("/notification", verfiyToken, notifications);
router.use("/message", verfiyToken, messages);


// categories
router.use('/subCategories', subCategoriesRouter);
router.use('/categories', categoriesRouter);

// service
router.use('/services', servicesRouter);
router.use('/upgrades', upgradesRouter);

// reviews
router.use('/reviews', reviewsRouter);

// admin
router.use('/admin', adminRouter);
export default router;
