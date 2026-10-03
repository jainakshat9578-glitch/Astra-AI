import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

const chatSlice=createSlice({
    name:"chat",
    initialState:{
        chats:{},
        currentChatId:null,
        isLoading:false,
        error:null
    },
    reducers:{

        createNewChat:(state,action)=>{
            const {chatId,title}=action.payload
            state.chats[chatId]={
                id:chatId,
                title,
                messages:[],
                lastUpdated:new Date().toISOString(),
            }
        },
        addNewMessage:(state,action)=>{
          const {chatId,content,role}=action.payload
          state.chats[chatId].messages.push({id:Date.now(), content, role })
          state.chats[chatId].lastUpdated = new Date().toISOString();
        },
        addMessages:(state,action)=>{
            const {chatId,messages}=action.payload
            state.chats[chatId].messages.push(...messages)
        },
        setChats:(state,action)=>{
            state.chats=action.payload
        },
        setCurrentChatId:(state,action)=>{
            state.currentChatId=action.payload
        },
        setLoading:(state,action)=>{
            state.isLoading=action.payload
        },
        setError:(state,action)=>{
            state.error=action.payload
        },
        setIsTyping:(state,action)=>{
            state.isTyping=action.payload
        },
        deleteChatsFromState:(state,action)=>{
            const chatId=action.payload
            delete state.chats[chatId]

            if(state.currentChatId===chatId){
                state.currentChatId=null
            }
        }

    }
})

export const {setChats,setCurrentChatId,setLoading,setError,createNewChat,addNewMessage,addMessages,setIsTyping,deleteChatsFromState}=chatSlice.actions
export default chatSlice.reducer

