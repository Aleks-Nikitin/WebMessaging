import { Router } from "express";
import chatContoller from "../controllers/chatContoller.js";
const chatRouter = Router();

chatRouter.post("/",chatContoller.createChat);

export default chatRouter