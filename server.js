const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

// Store chat history
const chatHistory = [];

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Send chat history to the new client
    socket.emit("chat history", chatHistory);

    // Listen for new messages
    socket.on("chat message", (data) => {
        const messageData = {
            id: socket.id,       // unique sender ID
            username: data.username,
            msg: data.msg,
            timestamp: data.timestamp || new Date().toLocaleTimeString()
        };
        chatHistory.push(messageData);
        io.emit("chat message", messageData);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

server.listen(3000, () => {
    console.log("💌 Lovely Chat App running on port 3000 💌");
});