import express, { urlencoded } from "express";
import cors from "cors";
const app = express();
app.use(cors());
app.use(express.urlencoded({extended:true}));

app.listen(3000,"localhost",(err)=>{
    if(err){
        throw new Error("server is down");
    }
    console.log("server started ..")
})