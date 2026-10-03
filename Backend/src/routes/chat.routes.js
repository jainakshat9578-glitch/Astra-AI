import { Router } from "express";
import { sendMessage,getChats,getMessage, deleteChats } from "../controllers/chat.controller.js";
import { authUser } from "../middleware/auth.middleware.js";


const chatRouter=Router()

chatRouter.post("/message",authUser,sendMessage)
// user agr login hoga tabhi message ki request kr payega

chatRouter.get("/",authUser,getChats)
chatRouter.get("/:chatId/messages",authUser,getMessage)

chatRouter.delete("/delete/:chatId",authUser,deleteChats)

export default chatRouter