const socket = io();

// Username handling
const usernameInput = document.getElementById("username");

if (localStorage.getItem("lovelyUsername")) {
    usernameInput.value = localStorage.getItem("lovelyUsername");
}

usernameInput.addEventListener("change", () => {
    localStorage.setItem("lovelyUsername", usernameInput.value.trim());
});

// Display messages
function addMessageToDOM(data) {
    const li = document.createElement("li");
    li.textContent = `${data.username}: ${data.msg}`;
    li.dataset.timestamp = data.timestamp;

    const currentUser = localStorage.getItem("lovelyUsername") || "Anonymous";
    if (data.username === currentUser) {
        li.classList.add("self");
    }

    li.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        const tooltip = document.createElement("span");
        tooltip.className = "tooltip";
        tooltip.textContent = `Sent at: ${li.dataset.timestamp}`;
        li.appendChild(tooltip);
        setTimeout(() => tooltip.remove(), 2000);
    });

    document.getElementById("messages").appendChild(li);
    const messagesEl = document.getElementById("messages");
    messagesEl.scrollTop = messagesEl.scrollHeight;
}

// Load history
socket.on("chat history", (messages) => {
    messages.forEach(addMessageToDOM);
});

// New message
socket.on("chat message", (data) => {
    addMessageToDOM(data);
});

// Send message
function sendMessage() {
    const input = document.getElementById("input");
    const username = usernameInput.value.trim() || "Anonymous";
    const msg = input.value.trim();

    if (msg) {
        const timestamp = new Date().toLocaleTimeString();
        socket.emit("chat message", { username, msg, timestamp });
        input.value = "";
        localStorage.setItem("lovelyUsername", username);
    }
}

// Enter key support
document.getElementById("input").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
    }
});

// 💖 FLOATING HEARTS (FIXED)
const heartBg = document.getElementById("heart-background");

function createHeart() {
    const heart = document.createElement("div");
    heart.classList.add("heart");

    // Use emoji (no CSS shape issues)
    heart.innerHTML = "🩷";

    // random position
    heart.style.left = Math.random() * 100 + "vw";

    // random size
    heart.style.fontSize = (Math.random() * 20 + 15) + "px";

    // random speed
    heart.style.animationDuration = (Math.random() * 3 + 2) + "s";

    heartBg.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 6000);
}

// create continuously
setInterval(createHeart, 300);


// Fix pseudo elements size dynamically
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
.heart::before, .heart::after {
    width: inherit;
    height: inherit;
}
`, styleSheet.cssRules.length);

styleSheet.insertRule(`
.heart::before { top: calc(-1 * var(--size) / 2); left: 0; }
`, styleSheet.cssRules.length);

styleSheet.insertRule(`
.heart::after { left: calc(var(--size) / 2); top: 0; }
`, styleSheet.cssRules.length);


// Generate hearts
setInterval(createHeart, 300);
