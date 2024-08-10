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

router.use("/collections", collections);
router.use("/carts", verfiyToken, checkRoles("user"), carts);
router.use("/posts", posts);
router.use("/orders", orders);
router.use("/users", users);
router.use("/notification", notifications);
router.use("/message", messages);


export default router;
