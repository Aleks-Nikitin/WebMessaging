import express, { urlencoded } from "express";
import cors from "cors";
import userRouter from "./routes/userRouter.js";
const app = express();
app.use(cors());
app.use(express.urlencoded({extended:true}));

app.use("/users",userRouter);

app.listen(3000,"localhost",(err)=>{
    if(err){
        throw new Error("server is down");
    }
    console.log("server started ..")
})