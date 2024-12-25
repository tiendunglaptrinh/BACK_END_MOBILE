import express from "express";
import PostController from "../controllers/postController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const postRouter = express.Router();

postRouter.post("/create/step1",authMiddleware,  PostController.createPostStep1);  
postRouter.post("/create/step2",authMiddleware,  PostController.createPostStep2);  
postRouter.post("/create/step3",authMiddleware,  PostController.createPostStep3);  

postRouter.post("/update/step1/:id",authMiddleware,  PostController.updatePostStep1);  
postRouter.post("/update/step2/:id",authMiddleware,  PostController.updatePostStep2);  
postRouter.post("/update/step3/:id",authMiddleware,  PostController.updatePostStep3);  

postRouter.get("/get-alls", PostController.getAllPosts);
postRouter.get("/get-post/:id", PostController.getPost);
export default postRouter;