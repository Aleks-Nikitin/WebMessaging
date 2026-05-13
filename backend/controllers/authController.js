import {prisma} from "../lib/prisma.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
async function verifyLogin(req,res) {

    let userFound = await prisma.user.findUnique({
        data:{
            email: req.body.email
        }
    });
    if(!userFound){
        return res.json({msg:"Username doesn't exist"});
        
    }
    let password = await bcrypt.compare(req.body.password,userFound.password);
    if(!password){
        return res.json({msg:"Invalid password"});
    }
    const accessToken= jwt.sign({username:userFound.email},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:"5m"});
    const refreshToken= jwt.sign({username:userFound.email},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn:"2d"});
    await prisma.user.update({
        where:{
            username:userFound.email
        },
        data:{
            refreshToken: refreshToken
        }
    })
}


export default {

}