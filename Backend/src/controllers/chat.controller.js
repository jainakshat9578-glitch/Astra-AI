import { generateResponse,generateChatTitle } from "../services/ai.service.js"
import chatModel from "../models/chat.model.js"
import messageModel from "../models/message.model.js"


export async function sendMessage(req,res){

    const { message,chatId}=req.body

    let title = null, chat = null;

    if(chatId){
        // If chatId exists, use existing chat
        chat = await chatModel.findOne({ _id: chatId, user: req.user.id })
        if(!chat){
            return res.status(404).json({ message: "Chat not found" })
        }
    } else {
        // If no chatId, create a new chat
        title = await generateChatTitle(message)
        chat = await chatModel.create({ user: req.user.id, title })
    }

    const userMessage=await messageModel.create({
        chat:chatId || chat._id,
        content:message,
        role:"user"
     })

    const messages=await messageModel.find({chat:chatId || chat._id})  // ek chat me jitne bhi message honge unko fetch karenge
 

    const result=await generateResponse(messages)

    const aiMessage=await messageModel.create({
       chat:chatId || chat._id,
       content:result,
       role:"ai"
    })


    res.status(201).json({
        title,
        chat,
        aiMessage
    })

}


export async function getChats(req,res){
    const user=req.user

    const chats=await chatModel.find({user:user.id})

    res.status(200).json({
        message:"chats received successfully",
        chats
    })
}


export async function getMessage(req,res){
    const {chatId}=req.params;

    const chat=await chatModel.findOne({
        _id:chatId,
        user:req.user.id
    })

    if(!chat){
        return res.status(404).json({
            message:"chat not found"
        })
    }

    const messages=await messageModel.find({
        chat:chatId
    })
    res.status(200).json({
        message:"messages received successsfuly",
        messages
    })
}

export async function deleteChats(req,res){
    const {chatId}=req.params

    const chat=await chatModel.findOneAndDelete({
        _id:chatId,
        user:req.user.id
    })

    await messageModel.deleteMany({
        chat:chatId
    })

    if(!chat){
        return res.status(404).json({
            message:"chat not found"
        })
    }

    res.status(200).json({
        message:"chat deleted successsfully"
    })
}