import { Router } from "express";
import userController from "../controllers/userController.js";
import authController from "../controllers/authController.js";
const userRouter = Router();

userRouter.get("/",authController.verifyJWT,userController.getUsers)
userRouter.get("/me",authController.verifyJWT,userController.getMe)
userRouter.post("/",userController.createUser);
userRouter.post("/login", authController.verifyLogin); // make it auth route and in a separate router
export default userRouter; 