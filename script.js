// Particle Connection banner effect
function startAnimation() {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const CURSOR_RADIUS = 100;
  let cursor = [-1500, -1500];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();

  // Generate particles
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 4;
      this.vx = (Math.random() - 0.5) * 1;
      this.vy = (Math.random() - 0.5) * 1;
    }
    draw() {
      ctx.beginPath();
      ctx.fillStyle = "#ffffff";
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
    }
  }

  let particles = Array.from({ length: 150 }, () => new Particle());

  window.addEventListener("resize", resizeCanvas);
  canvas.addEventListener("mousemove", e => {
    cursor = [e.clientX, e.clientY];
  });
  canvas.addEventListener("mouseleave", () => {
    cursor = [-1500, -1500];
  });

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      const dx = p.x - cursor[0], dy = p.y - cursor[1];
      const dist = Math.hypot(dx, dy);
      if (dist < CURSOR_RADIUS) {
        ctx.strokeStyle = "#ffffff";
        ctx.beginPath();
        ctx.moveTo(cursor[0], cursor[1]);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }
      p.draw();
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();
}
window.addEventListener("DOMContentLoaded", () => startAnimation());
window.addEventListener("resize", startAnimation);

// Ora AI Chat script
// 1) System prompt: only surface profile on “Who is Zakria Khan?”
const systemPrompt = `
You are Ora, a personal AI assistant.
Your user is Zakria Khan (also known as Zaky).
– Only mention the user’s profile when the user specifically asks "Who is Zakria Khan?" (or a close variant).
– Do NOT volunteer or repeat the profile on “Who am I?” or any other question.
When asked “Who is Zakria Khan?”, respond with:
  Name:                     Zakria Khan
  Role & Education:         BS Computer Science student at Agricultural University of Peshawar
  Location & Heritage:      Pashtun from Nowshera (MuhammadZai tribe), currently in Risalpur Cantt
  Philosophy:               Believes in real-world learning over traditional college; driven by discipline, legacy, and Pashtun honor
  Key Milestones:           Completed Harvard CS50x (May 10 2025) and CS50P (May 2025); now doing CS50W
  Tech Stack:               C, C++, Python, HTML5/CSS3 (responsive, modern design), JS, Flask; familiar with OOP, pointers, arrays, file handling
  Current Projects:         “Ora” AI assistant (Flask on Render + static frontend on GitHub Pages); hub at zakyprojects.site
  YouTube:                  Runs “Codebase” channel (coding tutorials)
  Interests & Values:       Inspired by Pashtun poets/leaders; reads unconventional theories on success and power
`;

// 2) Initialize history
let chatHistory = [
  { role: "system", content: systemPrompt }
];

// 3) Wire up input
const inputEl = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
inputEl.addEventListener("keydown", e => { if (e.key === "Enter") sendMessage(); });
sendBtn.addEventListener("click", sendMessage);

const backendURL = "https://ora-3b97.onrender.com/chat";

async function sendMessage() {
  const text = inputEl.value.trim();
  if (!text) return;
  
  // User bubble
  const chatBox = document.getElementById("chat-box");
  const userMsg = document.createElement("div");
  userMsg.className = "user-msg fade-in";
  userMsg.innerText = text;
  chatBox.appendChild(userMsg);

  chatHistory.push({ role: "user", content: text });
  inputEl.value = "";
  sendBtn.classList.add("loading");
  inputEl.disabled = true;

  try {
    const res = await fetch(backendURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: chatHistory })
    });
    const data = await res.json();
    const aiMsg = document.createElement("div");
    aiMsg.className = "ai-msg fade-in";
    aiMsg.innerText = data.reply;
    chatBox.appendChild(aiMsg);
    chatHistory.push({ role: "assistant", content: data.reply });
  } catch (err) {
    const errDiv = document.createElement("div");
    errDiv.className = "ai-msg fade-in";
    errDiv.innerText = "⚠️ Error: Could not reach Ora backend.";
    chatBox.appendChild(errDiv);
  } finally {
    sendBtn.classList.remove("loading");
    inputEl.disabled = false;
    inputEl.focus();
    document.getElementById("chat-box").scrollTop = document.getElementById("chat-box").scrollHeight;
  }
}