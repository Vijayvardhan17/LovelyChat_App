const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    room: String,
    username: String,
    msg: String,
    image: String,
    type: String,
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Message", messageSchema);
