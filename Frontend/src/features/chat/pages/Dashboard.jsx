import React, { useEffect, useState, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { useSelector, useDispatch } from 'react-redux'
import { useChat } from '../hooks/useChat'
import remarkGfm from 'remark-gfm'
import { setCurrentChatId } from '../chat.slice'
import { setUser } from '../../auth/auth.slice'
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import logo from"./Logo.png"


const Dashboard = () => {
  const chat = useChat()
  const dispatch = useDispatch()
  const [chatInput, setChatInput] = useState('')
  const chats = useSelector((state) => state.chat.chats)
  const currentChatId = useSelector((state) => state.chat.currentChatId)
  const messagesEndRef = useRef(null)
  const isTyping=useSelector((state)=>state.chat.isTyping)
  const navigate = useNavigate();

  useEffect(() => {
    chat.initializeSocketConnection()
    chat.handleGetChats()
    // chat.handleDeleteChats()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chats, currentChatId])

  const handleSubmitMessage = (event) => {
    event.preventDefault()
    const trimmedMessage = chatInput.trim()
    if (!trimmedMessage) return

    chat.handleSendMessage({ message: trimmedMessage, chatId: currentChatId || null})
    setChatInput('')
  }

  const openChat = (chatId) => {
    dispatch(setCurrentChatId(chatId))
    chat.handleOpenChat(chatId, chats)
  }

  const handleNewChat=()=>{
    dispatch(setCurrentChatId(null))
  }

  const handleLogout = async () => {
  try {
    await axios.post(
      "http://localhost:3000/api/auth/logout",
      {},
      { withCredentials: true }
    );

    // Clear user from Redux
    dispatch(setUser(null));

    // Go to login
    navigate("/login");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

  return (
    <main className='flex h-screen w-full bg-[#0b0c12] text-white'>
      {/* Sidebar */}
      <aside className='hidden md:flex md:flex-col w-72 bg-[#080b12] p-4 border-r border-white/10'>
      <div className='flex items-center '>
        <h1 className='sticky top-0 mb-4 text-3xl font-semibold'>Astra AI</h1>
              
              </div>
        <button className='mb-4 w-full rounded-xl bg-white/10 hover:bg-white/20 px-4 py-2 font-medium' 
        onClick={handleNewChat}
        >+ New Chat
        </button>
        <div className='sidebar flex-1 overflow-y-scroll space-y-1'>
          {Object.values(chats).sort((a,b)=>new Date(b.lastUpdated)-new Date(a.lastUpdated)).map((chatItem) => (
            <div 
            key={chatItem.id}
            className={`group flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition
          ${chatItem.id === currentChatId 
            ? 'bg-white/20 text-white' 
            : 'text-white/80 hover:bg-white/10'}
        `}
            >
            <button
              onClick={() => openChat(chatItem.id)}
              className={`w-full text-left text-sm font-medium
                `}
            >
              {chatItem.title}
            </button>

            <button 
            onClick={()=>chat.handleDeleteChats(chatItem.id)}
            className='opacity-0 group-hover:opacity-100 text-white/50 hover:text-red-400 transition'>
              🗑️

              </button>
              </div>
          ))}
        </div>
        <div className='mt-4 pt-3 border-t border-white/10'>
  <button
    onClick={handleLogout}
    className='w-full flex items-center gap-3 px-3 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition'
  >
    <span className='text-lg'>↪</span>
    <span className='font-medium'>Logout</span>
  </button>
</div>
      </aside>

      {/* Chat Area */}
      <section className='flex flex-col flex-1 relative'>
        {!currentChatId ? (
            <div className="flex flex-1 items-center justify-center text-center">
    <div>
       <h1 className="text-3xl md:text-4xl font-semibold mb-3">
        Welcome to Astra AI 🚀
      </h1>



      <p className="text-white/60 text-sm md:text-base">
        Start a new conversation and explore AI-powered answers.
      </p>
    </div>
  </div>
        ):(

        
        <div className=' messages flex-1 overflow-y-auto p-4 space-y-3'>
          {chats[currentChatId]?.messages.map((message) => (
            <div
              key={message.id}
              className={`max-w-[75%] w-fit px-4 py-3 rounded-2xl text-sm md:text-base 
                ${message.role === 'user' 
                  ? 'ml-auto bg-white/12 text-white rounded-br-none' 
                  : 'mr-auto bg-[#1a1c26] text-white/90'}`
              }
            >
              {message.role === 'user' ? (
                <p>{message.content}</p>
              ) : (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ children }) => <p className='mb-2 last:mb-0'>{children}</p>,
                    ul: ({ children }) => <ul className='mb-2 list-disc pl-5'>{children}</ul>,
                    ol: ({ children }) => <ol className='mb-2 list-decimal pl-5'>{children}</ol>,
                    code: ({ children }) => <code className='rounded bg-white/10 px-1 py-0.5'>{children}</code>,
                    pre: ({ children }) => <pre className='mb-2 overflow-x-auto rounded-xl bg-black/30 p-3'>{children}</pre>,
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              )}
            </div>
          ))}
           
    {isTyping && (
      <div className="mr-auto max-w-[60%] rounded-2xl px-4 py-3 text-sm bg-[#1a1c26] text-white/80 flex gap-1">
        <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
        <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-100"></span>
        <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-200"></span>
      </div>
    )}
          <div ref={messagesEndRef} />
        </div>
        )}

        {/* Footer Input */}
        <footer className='sticky bottom-0 w-full border-t border-white/10 bg-[#080b12] p-4'>
          <form onSubmit={handleSubmitMessage} className='flex gap-3'>
            <input
              type='text'
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder='Type your message...'
              className='flex-1 rounded-2xl border border-white/20 bg-transparent px-4 py-3 text-white placeholder:text-white/50 outline-none focus:border-white/50'
            />
            <button
              type='submit'
              disabled={!chatInput.trim()}
              className='rounded-2xl bg-white/10 px-6 py-3 font-semibold text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Send
            </button>
          </form>
        </footer>
      </section>
    </main>
  )
}

export default Dashboard

