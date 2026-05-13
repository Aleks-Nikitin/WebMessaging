import express, { urlencoded } from "express";
import cors from "cors";
import userRouter from "./routes/userRouter.js";
import cookieParser from "cookie-parser";
import refreshRouter from "./routes/refreshRouter.js";
import logoutRouter from "./routes/logoutRouter.js";
const app = express();
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use("/logout",logoutRouter);
app.use("/refresh",refreshRouter);
app.use("/users",userRouter);

app.listen(3000,"localhost",(err)=>{
    if(err){
        throw new Error("server is down");
    }
    console.log("server started ..")
})