import express from "express";
import {
  get,
  create,
  login,
  logout,
  update,
  del,
  getProfile,
  getAll,
  updateEmailVerified,
} from "../controller/users.js";
import upload from "../middleware/multer.config.js";
import { authenticateUser, checkRoles, verfiyToken } from "../middleware/auth.js";
const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", verfiyToken, getProfile);
router.get("/:id", get);
router.get("/", getAll);
router.post("/", upload.fields([{name:"profilePicture", maxCount: 1}]), create);
router.patch("/:id", verfiyToken, upload.fields([{name:"profilePicture", maxCount: 1}]), update);
router.patch("/dashboard/:id", authenticateUser,checkRoles("admin"), updateEmailVerified);
router.delete("/:id", verfiyToken, del);
export default router;
