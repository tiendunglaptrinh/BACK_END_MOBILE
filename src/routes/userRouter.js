import express from "express";
import UserController from "../controllers/userController.js";
// import { authMiddleware } from "../middleware/AuthMiddleware.js";

const userRouter = express.Router();

userRouter.post("/register/step1", UserController.createUserStep1);  
userRouter.post("/register/step2", UserController.createUserStep2);  

export default userRouter;