import express from "express";
import PostController from "../controllers/postController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const postRouter = express.Router();

postRouter.post("/create/step1",authMiddleware,  PostController.createPostStep1);  
postRouter.post("/create/step2",authMiddleware,  PostController.createPostStep2);  
postRouter.post("/create/step3",authMiddleware,  PostController.createPostStep3);  

export default postRouter;