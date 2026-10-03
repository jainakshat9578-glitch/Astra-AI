import dotenv from "dotenv/config"
import app from './src/app.js';
import http from "http"
import connectDB from './src/config/database.js';
import { initSocket } from "./src/sockets/server.socket.js";


const PORT = process.env.PORT || 3000;


const httpServer = http.createServer(app);

initSocket(httpServer)

// Connect to database
connectDB()
.catch((err)=>{
console.error("mongodb connection failed",err)
process.exit(1)
})



// Start server
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



