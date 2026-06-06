import express, { urlencoded } from "express";
import cors from "cors";
import corsOptions from "./config/corsOptions.js";
import userRouter from "./routes/userRouter.js";
import chatRouter from "./routes/chatRouter.js";
import cookieParser from "cookie-parser";
import refreshRouter from "./routes/refreshRouter.js";
import logoutRouter from "./routes/logoutRouter.js";
import msgRouter from "./routes/msgRouter.js";
import credentials from "./config/credentials.js";
const app = express();
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use("/logout",logoutRouter);
app.use("/refresh",refreshRouter);
app.use("/users",userRouter);
app.use("/chats",chatRouter)
app.use("/messages",msgRouter);
app.listen(3000,"localhost",(err)=>{
    if(err){
        throw new Error("server is down");
    }
    console.log("server started ..")
})