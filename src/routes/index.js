import JwtService from "../services/jwtService.js";
import userRouter from "./userRouter.js";
import siteRouter from "./siteRouter.js"
import postRouter from "./postRouter.js";

function route(app) {
  app.use("/user", userRouter);
  app.use("/post", postRouter);
  app.use("/", siteRouter);
};

export default route;