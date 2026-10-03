import { initializeSocketConnection } from "../service/chat.socket.js";
import { sendMessage,getChats,getMessages,deleteChats } from "../service/chat.api.js";
import { useDispatch,useSelector } from "react-redux";
import { setChats,setCurrentChatId,setLoading,setError,createNewChat,addNewMessage,addMessages,setIsTyping,deleteChatsFromState } from "../chat.slice.js";
import { useEffect,useState } from "react";


export const useChat=()=>{

    const chats = useSelector((state) => state.chat.chats)
const currentChatId = useSelector((state) => state.chat.currentChatId)

    const dispatch=useDispatch()

    useEffect(()=>{
        if(chats && Object.keys(chats).length>0 && !currentChatId){
            const firstChatId=Object.keys(chats)[0]
            console.log("AUTO SELECT CHAT:",firstChatId)

            dispatch(setCurrentChatId(firstChatId))
        }
    },[chats])

// async function handleSendMessage({ message, chatId }) {
    
//     dispatch(setLoading(true));
//     dispatch(setIsTyping(true))

//     try {
//         const data = await sendMessage({ message, chatId }); // send chatId to backend
        
//         const { chat, aiMessage, title } = data;

     
//         // If it's a new chat, add it to Redux
//         if (!chatId) {
//             dispatch(createNewChat({
//                 chatId: chat._id,
//                 title: chat.title || title,
//                 lastUpdated: new Date().toISOString()
//             }));
//             dispatch(setCurrentChatId(chat._id));
//         }
        

//         // Add user's message
//         dispatch(addNewMessage({
//             chatId: chatId || chat._id,
//             content: message,
//             role: "user"
//         }));

//         dispatch(setIsTyping(true))

//         // Add AI's message
//         dispatch(addNewMessage({
//             chatId: chatId || chat._id,
//             content: aiMessage.content,
//             role: "ai"
//         }));

//     } catch (err) {
//         console.error(err);
//     } finally {
//         dispatch(setLoading(false));
//         dispatch(setIsTyping(false))
//     }
   
// }
async function handleSendMessage({ message, chatId }) {

    dispatch(setLoading(true));
    dispatch(setIsTyping(true));

    let tempId = null;
    let currentId = chatId;

    try {

        // ✅ NEW CHAT → instant UI
        if (!chatId) {
            tempId = "temp-" + Date.now();

            dispatch(createNewChat({
                chatId: tempId,
                title: "New Chat",
                lastUpdated: new Date().toISOString()
            }));

            dispatch(setCurrentChatId(tempId));
            currentId = tempId;

            dispatch(addNewMessage({
                chatId: tempId,
                content: message,
                role: "user"
            }));
        }

        // ✅ EXISTING CHAT → instant message
        if (chatId) {
            dispatch(addNewMessage({
                chatId,
                content: message,
                role: "user"
            }));
        }

        // ✅ API CALL
        const data = await sendMessage({ message, chatId });
        const { chat, aiMessage } = data;
        const realChatId = chat._id;

        // ✅ REPLACE TEMP CHAT
      if (!chatId && tempId) {

    // ✅ manually keep user message
    const tempMessages = [
        {
            id: Date.now(),
            content: message,
            role: "user"
        }
    ];

    dispatch(deleteChatsFromState(tempId));

    dispatch(createNewChat({
        chatId: realChatId,
        title: chat.title
    }));

    dispatch(addMessages({
        chatId: realChatId,
        messages: tempMessages
    }));

    dispatch(setCurrentChatId(realChatId));

    currentId = realChatId;
}


        // ✅ ADD AI MESSAGE
        dispatch(addNewMessage({
            chatId: currentId,
            content: aiMessage.content,
            role: "ai"
        }));

    } catch (err) {
        console.error(err);
    } finally {
        dispatch(setLoading(false));
        dispatch(setIsTyping(false));
    }
}



    async function handleGetChats() {
    dispatch(setLoading(true))
    const data = await getChats()
    const { chats } = data

    // convert array to object with chatId as key
    const chatsObj = {}
    for (const chat of chats) {
        // fetch messages for this chat
        const messagesData = await getMessages(chat._id)  // call backend API
        chatsObj[chat._id] = {
            id: chat._id,
            title: chat.title,
            messages: messagesData.messages || [],
            lastUpdated: chat.updatedAt
        }
    }

    dispatch(setChats(chatsObj))
    dispatch(setLoading(false))
}


    async function handleOpenChat(chatId,chats){
        console.log("OPEN CHAT :",chatId)
        if(chats[chatId]?.messages.length===0){
        const data=await getMessages(chatId)
        const {messages}=data

       const formattedMessages=messages.map(msg=>({
        content:msg.content,
        role:msg.role,
       }))
       dispatch(addMessages({
        chatId,
        messages:formattedMessages
       }))
    }
       dispatch(setCurrentChatId(chatId))
    }

    async function handleDeleteChats(chatId){
        try{
            await deleteChats(chatId)

            dispatch(deleteChatsFromState(chatId))
        }catch(err){
            console.error(err)
        }
    }

    return {
        initializeSocketConnection,
        handleSendMessage,
        handleGetChats,
        handleOpenChat,
        handleDeleteChats
    }
}