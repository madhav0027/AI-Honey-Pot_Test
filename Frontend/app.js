const chatBox = document.getElementById("chatBox");
const input = document.getElementById("messageInput");

// Change this to your backend endpoint
const API_URL = "http://localhost:5000/message";

function addMessage(text, sender) {
  const div = document.createElement("div");
  div.className = `message ${sender}`;
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "scammer");
  input.value = "";

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: text })
    });

    const data = await res.json();

    console.log(data)

    // Expecting: { reply: "text here" }
    addMessage(data.reply, "bot");

  } catch (err) {
    addMessage("Server error", "bot");
  }
}

// Press Enter to send
input.addEventListener("keydown", e => {
  if (e.key === "Enter") sendMessage();
});
