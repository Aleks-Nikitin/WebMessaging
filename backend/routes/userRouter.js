import { Router } from "express";
import userController from "../controllers/userController.js";
import authController from "../controllers/authController.js";
const userRouter = Router();

userRouter.get("/",authController.verifyJWT,userController.getCleanUsers)
userRouter.get("/me",authController.verifyJWT,userController.getMe)
userRouter.post("/update/firstname",authController.verifyJWT,userController.updateFirstname);
userRouter.post("/update/lastname",authController.verifyJWT,userController.updateLastname);
userRouter.post("/update/email",authController.verifyJWT,userController.updateEmail);
userRouter.post("/",userController.createUser);
userRouter.post("/login", authController.verifyLogin); // make it auth route and in a separate router
export default userRouter; 