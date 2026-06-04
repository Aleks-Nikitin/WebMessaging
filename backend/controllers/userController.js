import { validationResult,matchedData,body } from "express-validator";
import {prisma} from "../lib/prisma.js"
import bcrypt from "bcryptjs";
const lengthErr= "ERROR: length of the input must be more than 1";
const emailErr= "Not a valid email";
const nameErr ="ERROR:Lastname and firstname needs to contain only letters (A-Z, a-z)"
const passwordErr="ERROR: Password Minimum length: 8 characters Minimum of 1 lowercase character ,Minimum of 1 uppercase character,Minimum of 1 number,Minimum of 1 symbol "
const validateUser=[
    body("firstname").trim().isAlpha().withMessage(nameErr)
    .isLength({min:1}).withMessage(`${lengthErr} first name`),
    body("lastname").trim().isAlpha().withMessage(nameErr)
    .isLength({min:1}).withMessage(`${lengthErr} last name`),
    body("email").trim()
    .isEmail().withMessage(`ERROR:${emailErr}`),
    body("password").trim()
    .isStrongPassword().withMessage(`${passwordErr}`),
    body("confpassword").trim()
    .custom((value,{req})=>{
        return value ==req.body.password;
    }).withMessage("ERROR:passwords don't match"),
   
] 
const createUser = [validateUser, async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.json(errors);
    }
    const {firstname,lastname,email,password}=matchedData(req);
    const hashedPassword = await bcrypt.hash(password,10);
    await prisma.user.create({
        data:{
            firstname:firstname,
            lastname:lastname,
            email:email,
            password:hashedPassword
        }
    })
    res.json({msg:"user created"})

}]
async function getMe(req,res) {
    const id=req.user;
    const user = await prisma.user.findUnique({
        where:{
            id:Number(id)
        }
    })
    return res.json({user:user});
    
}
async function getUsers(req,res) {
    const users = await prisma.user.findMany();
    res.json(users);
}
async function getCleanUsers(req,res) {
    const users = await prisma.user.findMany();
    const cleanUsers= Object.values(users).map(({password,refreshToken,email, ...rest})=>rest );
    res.json(cleanUsers);
}

export default {
    getUsers,
    getCleanUsers,
    getMe,
    createUser
}