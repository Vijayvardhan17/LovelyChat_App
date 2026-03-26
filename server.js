const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

const rooms = {};

io.on("connection", (socket) => {
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
    io.to(room).emit("user count", rooms[room].users.size);

    // Join message
    const joinMsg = {
        msg: `${username} joined the chat 💕`,
        type: "system"
    };

    rooms[room].messages.push(joinMsg);
    io.to(room).emit("chat message", joinMsg);

    socket.emit("chat history", rooms[room].messages);

    socket.on("chat message", (data) => {
        const messageData = {
            username: data.username,
            msg: data.msg || "",
            image: data.image || null
        };

        rooms[room].messages.push(messageData);
        io.to(room).emit("chat message", messageData);
    });

    socket.on("clear chat", () => {
        rooms[room].messages = [];
        io.to(room).emit("chat cleared");
    });

    socket.on("disconnect", () => {
        rooms[room].users.delete(username);
        io.to(room).emit("user count", rooms[room].users.size);
    });
});

server.listen(3000, () => {
    console.log("💌 Lovely Chat App running on port 3000 💌");
});