import { Router } from "express";
import msgController from "../controllers/msgController.js";
const msgRouter =Router();

msgRouter.post("/",msgController.createMsg);

export default msgRouter;