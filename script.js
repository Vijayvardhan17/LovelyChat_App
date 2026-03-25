const socket = io();

// --- Get or set username in localStorage ---
const usernameInput = document.getElementById("username");
if (localStorage.getItem("lovelyUsername")) {
    usernameInput.value = localStorage.getItem("lovelyUsername");
}

usernameInput.addEventListener("change", () => {
    localStorage.setItem("lovelyUsername", usernameInput.value.trim());
});

// --- Function to display messages ---
function addMessageToDOM(data) {
    const li = document.createElement("li");
    li.textContent = `${data.username}: ${data.msg}`;
    li.dataset.timestamp = data.timestamp;

    // Compare message username to local stored username
    const currentUser = localStorage.getItem("lovelyUsername") || "Anonymous";
    if (data.username === currentUser) {
        li.classList.add("self"); // right-side
    }

    // Right-click to show timestamp
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

// --- Load chat history ---
socket.on("chat history", (messages) => {
    messages.forEach(data => addMessageToDOM(data));
});

// --- Listen for new messages ---
socket.on("chat message", (data) => {
    addMessageToDOM(data);
});

// --- Send message ---
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

// --- Enter key sends message ---
const inputField = document.getElementById("input");
inputField.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
    }
});