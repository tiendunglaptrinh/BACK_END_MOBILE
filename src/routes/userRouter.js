import express from "express";
import UserController from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

userRouter.post("/register/step1", UserController.createUserStep1);
userRouter.post("/register/step2", UserController.createUserStep2);

userRouter.post("/login", UserController.loginUser);

userRouter.get("/get-info", authMiddleware, UserController.getInfo);
userRouter.get("/get-posts", authMiddleware, UserController.getPosts);

userRouter.post("/update", authMiddleware, UserController.updateInfo);
userRouter.post("/change-pass", authMiddleware, UserController.changePassword);

export default userRouter;
