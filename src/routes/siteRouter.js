import express from "express";
import JwtService from "../services/jwtService.js";

const siteRouter = express.Router();

siteRouter.post("/refresh-token", JwtService.refreshTokenService);  

export default siteRouter;