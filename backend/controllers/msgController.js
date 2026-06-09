import {prisma} from "../lib/prisma.js"
async function createMsg(req,res) {
    const {senderId,chatId,text} = req.body;
   const msg= await prisma.message.create({
        data:{
            text:text,
            userId:Number(senderId),
            chatId:Number(chatId)
        }
        
    }); 
    
    res.json({text:text,userId:senderId,chatId:chatId,id:msg.id})
}  
 
export default {
    createMsg
}