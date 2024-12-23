import userRouter from "./userRouter.js";

function route(app) {
  app.use("/user", userRouter);
//   app.use("/post", postRouter);
};

export default route;