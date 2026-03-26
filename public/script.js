let socket;
let username;
let room;
let selectedImage = null;

function joinChat() {
    username = document.getElementById("login-username").value.trim();
    room = document.getElementById("login-room").value.trim();

    if (!username || !room) return alert("Enter details 💖");

    socket = io({ auth: { username, room } });

    document.getElementById("login-screen").style.display = "none";
    document.getElementById("chat-container").style.display = "flex";

    setupSocket();
}

function setupSocket() {
    socket.on("chat history", msgs => {
        document.getElementById("messages").innerHTML = "";
        msgs.forEach(addMessage);
    });

    socket.on("chat message", addMessage);

    socket.on("user count", count => {
        document.getElementById("user-count").textContent =
            `👥 ${count} users online`;
    });

    socket.on("chat cleared", () => {
        document.getElementById("messages").innerHTML = "";
    });
}

function addMessage(data) {
    const li = document.createElement("li");

    if (data.type === "system") {
        li.textContent = data.msg;
        li.classList.add("system-msg");
    } else {
        li.innerHTML = `<span class="username">${data.username}:</span> ${data.msg}`;

        if (data.image) {
            const img = document.createElement("img");
            img.src = data.image;
            img.style.maxWidth = "150px";
            li.appendChild(img);
        }

        if (data.username === username) {
            li.classList.add("self");
        } else {
            li.classList.add("other");
        }
    }

    const messages = document.getElementById("messages");
    messages.appendChild(li);

    messages.scrollTop = messages.scrollHeight;
}

function sendMessage() {
    const input = document.getElementById("input");
    const msg = input.value.trim();

    if (!msg && !selectedImage) return;

    socket.emit("chat message", {
        username,
        msg,
        image: selectedImage
    });

    input.value = "";
    selectedImage = null;
}

function clearChat() {
    socket.emit("clear chat");
}

function toggleEmoji() {
    const panel = document.getElementById("emoji-panel");
    panel.style.display = panel.style.display === "none" ? "block" : "none";
}

document.addEventListener("DOMContentLoaded", () => {

    document.querySelectorAll("#emoji-panel span").forEach(e => {
        e.onclick = () => {
            document.getElementById("input").value += e.textContent;
        };
    });

    document.getElementById("imageInput").addEventListener("change", function () {
        const reader = new FileReader();
        reader.onload = e => selectedImage = e.target.result;
        reader.readAsDataURL(this.files[0]);
    });

});

document.addEventListener("keypress", e => {
    if (e.key === "Enter") sendMessage();
});
// 💖 FLOATING HEARTS
const heartBg = document.getElementById("heart-background");

function createHeart() {
    const heart = document.createElement("div");
    heart.classList.add("heart");

    heart.innerHTML = "🩷";

    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = (Math.random() * 20 + 15) + "px";
    heart.style.animationDuration = (Math.random() * 3 + 2) + "s";

    heartBg.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 6000);
}

// generate hearts continuously
setInterval(createHeart, 300);