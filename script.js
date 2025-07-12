let chatHistory = [
  { role: "system", content: systemPrompt }
];

document.getElementById("userInput").addEventListener("keydown", function (event) {
    if (event.key === "Enter") sendMessage();
});
const backendURL = "https://ora-3b97.onrender.com/chat";
document.getElementById("sendBtn").addEventListener("click", sendMessage);
async function sendMessage() {
    const input = document.getElementById("userInput");
    const sendBtn = document.getElementById("sendBtn");
    const message = input.value.trim();
    if (!message) return;
    const chatBox = document.getElementById("chat-box");
    const userMsg = document.createElement("div");
    userMsg.className = "user-msg fade-in";
    userMsg.innerText = message;
    chatBox.appendChild(userMsg);
    input.value = "";
    sendBtn.classList.add("loading");
    input.disabled = true;
    try {
        console.log("Sending message to backend:", message);
        const res = await fetch(backendURL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message }) });
        console.log("Received response from backend");
        const data = await res.json();
        console.log("AI Reply:", data.reply);
        const aiMsg = document.createElement("div");
        aiMsg.className = "ai-msg fade-in";
        aiMsg.innerText = data.reply;
        chatBox.appendChild(aiMsg);
    } catch (err) {
        const errorMsg = document.createElement("div");
        errorMsg.className = "ai-msg fade-in";
        errorMsg.innerText = "⚠️ Error: Could not reach Ora backend.";
        chatBox.appendChild(errorMsg);
    } finally {
        sendBtn.classList.remove("loading");
        input.disabled = false;
        input.focus();
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}
