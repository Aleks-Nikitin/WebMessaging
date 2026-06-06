import {prisma} from "../lib/prisma.js"
async function createMsg(req,res) {
    const {senderId,chatId,text} = req.body;
    await prisma.message.create({
        data:{
            text:text,
            userId:Number(senderId),
            chatId:Number(chatId)
        }
    })
    res.json({msg:"sent"})
}

export default {
    createMsg
}