import express from "express";
const router = express.Router();
import collections from "./collections.js";
import carts from "./carts.js";
import posts from "./posts.js";
import orders from "./orders.js";
import users from "./users.js";
import { verfiyToken, checkRoles } from "../middleware/auth.js";
// routers
import subCategoriesRouter from './subCategories.js';
import categoriesRouter from './categories.js';
import servicesRouter from './service.js';
import reviewsRouter from './reviews.js';
import upgradesRouter from './upgrade.js'

router.use("/collections", collections);
router.use("/carts", verfiyToken, checkRoles("user"), carts);
router.use("/posts", posts);
router.use("/orders", orders);
router.use("/users", users);

// categories
app.use('/subCategories', subCategoriesRouter);
app.use('/categories', categoriesRouter);

// service
app.use('/services', servicesRouter);
app.use('/upgrades', upgradesRouter);

// reviews
app.use('/reviews', reviewsRouter);

export default router;
