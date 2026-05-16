import {prisma} from "../lib/prisma.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
async function verifyLogin(req,res) {
    let userFound = await prisma.user.findUnique({
        where:{
            email: req.body.email
        }
    });
    if(!userFound){
        return res.status(401).json({msg:"Username doesn't exist"});
        
    }

    let password = await bcrypt.compare(req.body.password,userFound.password);
    if(!password){
        return res.status(401).json({msg:"Invalid password"});
    }
    const accessToken= jwt.sign({id:userFound.id},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:"15m"});
    const refreshToken= jwt.sign({id:userFound.id},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn:"2d"});
    await prisma.user.update({
        where:{
            id:Number(userFound.id)
        },
        data:{
            refreshToken:refreshToken
        }
    })
    res.cookie("jwt", refreshToken,{
        secure: process.env.NODE_ENV ==="production",
        httpOnly:true,
        maxAge:2*24*60*60*1000,
    });
    res.json({accessToken:accessToken});
}
async function verifyJWT(req,res,next) {
    const authHeader = req.headers["authorization"];
    if(!authHeader) return res.sendStatus(401);
    const token = authHeader.split(" ")[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err,decoded)=>{
            if(err) return res.sendStatus(403); //invalid token
            req.user=decoded.id;
            next()
        }
    )

}

export default {
    verifyLogin,
    verifyJWT
}