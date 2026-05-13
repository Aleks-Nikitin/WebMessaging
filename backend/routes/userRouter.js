import { Router } from "express";
import userController from "../controllers/userController.js";
const userRouter = Router();

userRouter.get("/",userController.getUsers)
userRouter.post("/",userController.createUser);
export default userRouter;