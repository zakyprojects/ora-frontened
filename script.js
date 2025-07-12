// 1) System prompt: only surface your profile on “Who is Zakria Khan?”
const systemPrompt = `
You are Ora, a personal AI assistant.
Your user is Zakria Khan (also known as Zaky).
– Only mention the user’s profile when the user specifically asks “Who is Zakria Khan?” (or a close variant).
– Do NOT volunteer or repeat the profile on “Who am I?” or any other question.
When asked “Who is Zakria Khan?”, respond with:
  Name:                     Zakria Khan
  Role & Education:         BS Computer Science student at Agricultural University of Peshawar
  Location & Heritage:      Pashtun from Nowshera (MuhammadZai tribe), currently in Risalpur Cantt
  Philosophy:               Believes in real-world learning over traditional college; driven by discipline, legacy, and Pashtun honor
  Key Milestones:           Completed Harvard CS50x (May 10 2025) and CS50P (May 2025); now on video 89/139 of CodeWithHarry’s Web Dev course
  Tech Stack:               C, Python, HTML5/CSS3 (responsive, modern design), vanilla JS; familiar with OOP, pointers, arrays, file handling
  Current Projects:         “Ora” AI assistant (Flask on Render + static frontend on GitHub Pages); hub at zakyprojects.site
  YouTube & SEO:            Runs “Codebase” channel (coding tutorials, SEO chapters)
  Interests & Values:       Inspired by Pashtun poets/leaders; reads unconventional theories on success and power
`;

// 2) Initialize chat history with that prompt
let chatHistory = [
  { role: "system", content: systemPrompt }
];

// 3) Wire up the input
document.getElementById("userInput")
  .addEventListener("keydown", e => { if (e.key === "Enter") sendMessage(); });
document.getElementById("sendBtn")
  .addEventListener("click", sendMessage);

const backendURL = "https://ora-3b97.onrender.com/chat";

async function sendMessage() {
  const input   = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");
  const text    = input.value.trim();
  if (!text) return;

  // Show user bubble
  const chatBox = document.getElementById("chat-box");
  const userMsg = document.createElement("div");
  userMsg.className = "user-msg fade-in";
  userMsg.innerText = text;
  chatBox.appendChild(userMsg);

  // Add to history
  chatHistory.push({ role: "user", content: text });

  // Reset UI
  input.value = "";
  sendBtn.classList.add("loading");
  input.disabled = true;

  try {
    // Send entire history
    const res = await fetch(backendURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: chatHistory })
    });
    const data = await res.json();

    // Append AI reply
    const aiMsg = document.createElement("div");
    aiMsg.className = "ai-msg fade-in";
    aiMsg.innerText = data.reply;
    chatBox.appendChild(aiMsg);

    // Save to history
    chatHistory.push({ role: "assistant", content: data.reply });
  } catch (err) {
    const errDiv = document.createElement("div");
    errDiv.className = "ai-msg fade-in";
    errDiv.innerText = "⚠️ Error: Could not reach Ora backend.";
    chatBox.appendChild(errDiv);
  } finally {
    sendBtn.classList.remove("loading");
    input.disabled = false;
    input.focus();
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}
