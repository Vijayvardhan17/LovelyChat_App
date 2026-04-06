require("dotenv").config();
const mongoose = require("mongoose");
const Message = require("./models/Message");

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

const rooms = {};

io.on("connection", async (socket) => {
    const room = socket.handshake.auth.room;
    const username = socket.handshake.auth.username;

    if (!room || !username) {
        socket.disconnect();
        return;
    }

    socket.join(room);

    if (!rooms[room]) {
        rooms[room] = {
            messages: [],
            users: new Set()
        };
    }

rooms[room].users.add(username);

// send count
io.to(room).emit("user count", rooms[room].users.size);

// 🔥 send user list
io.to(room).emit("user list", Array.from(rooms[room].users));
    // Join message
    const joinMsg = {
        msg: `${username} joined the chat 💕`,
        type: "system"
    };

    rooms[room].messages.push(joinMsg);
    io.to(room).emit("chat message", joinMsg);

const oldMessages = await Message.find({ room }).sort({ timestamp: 1 });
socket.emit("chat history", oldMessages);

   socket.on("chat message", async (data) => {

    const messageData = new Message({
        room,
        username: data.username,
        msg: data.msg,
        image: data.image,
        timestamp: new Date()
    });

    await messageData.save();

    io.to(room).emit("chat message", messageData);
});

    socket.on("clear chat", async () => {
    await Message.deleteMany({ room });
    io.to(room).emit("chat cleared");
});

    socket.on("disconnect", () => {
       rooms[room].users.delete(username);

io.to(room).emit("user count", rooms[room].users.size);
io.to(room).emit("user list", Array.from(rooms[room].users));
    });
    // ✍️ Typing event
socket.on("typing", () => {
    socket.to(room).emit("typing", username);
});

// 🛑 Stop typing
socket.on("stop typing", () => {
    socket.to(room).emit("stop typing");
});
});

server.listen(3000, () => {
    console.log("💌 Lovely Chat App running on port 3000 💌");
});
mongoose.connect(process.env.MONGO_URI, {
    family: 4,
    serverSelectionTimeoutMS:5000
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log(err));
console.log(process.env.MONGO_URI);
