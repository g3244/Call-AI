const input = document.querySelector(".chat-input");
const chatBox = document.querySelector(".chat-box");
const welcomeScreen = document.querySelector(".welcome-screen");

const sendBtn = document.getElementById("sendBtn");
const stopBtn = document.querySelector(".stopBtn");

let pdfText = "";
let stopWriting = false;

/* =========================
   CHAT MEMORY
========================= */

let chatHistory = [];

/* =========================
   Scroll
========================= */

function scrollToBottom() {
  chatBox.scrollTop = chatBox.scrollHeight;
}

/* =========================
   Auto resize input
========================= */

input.addEventListener("input", function () {
  this.style.height = "40px";
  this.style.height = this.scrollHeight + "px";
});

/* =========================
   Load PDF
========================= */

async function loadPDF() {
  try {
    const pdf = await pdfjsLib.getDocument("data.pdf").promise;

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      const text = content.items.map(item => item.str).join(" ");
      pdfText += text + " ";
    }

    console.log("PDF Loaded");
  } catch (error) {
    console.log("PDF Error:", error);
  }
}

loadPDF();

/* =========================
   Gemini AI (WITH MEMORY)
========================= */

let textData = "";

// 1) تحميل ملف النص
async function loadText() {
  try {
    const res = await fetch("data.txt");
    textData = await res.text();
    console.log("Text loaded ✔");
  } catch (error) {
    console.log("Text load error:", error);
  }
}

// 2) تحميل النص أول ما الصفحة تفتح
window.addEventListener("load", async () => {
  await loadText();
});

// 3) دالة Gemini
async function getGeminiAnswer(userText) {

  if (!textData) {
    return "Text not loaded yet, please wait...";
  }

  const API_KEY = "AQ.Ab8RN6KIQzOgKXzu8UBxXogyfWcJneGoRW7gULq4srLMlnVDsg";

  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
    API_KEY;

  const prompt = `
هذا النظام يجيب على الأسئلة باستخدام محتوى هذا الملف فقط في الأمور الدينية الإسلامية.

إذا كان السؤال دينيًا أو إسلاميًا ووجدت الإجابة داخل هذا الملف، أجب منها مباشرة.

إذا كان السؤال دينيًا أو إسلاميًا ولم توجد الإجابة داخل هذا الملف، اكتب فقط:

"لم أجد إجابة، سيتم تسجيل الإجابات قريبًا."

إذا كان السؤال غير ديني، يمكن استخدام المعرفة العامة للإجابة.

---

محتوى الملف:
${textData}

---

السؤال:
${userText}
`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ]
      })
    });

    const data = await response.json();

    console.log(data);

    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

  } catch (error) {
    console.log(error);
    return "Connection error";
  }
}

/* =========================
   Send Message
========================= */

async function sendMessage() {

  const rawText = input.value.trim();

  if (rawText === "") return;

  // user message UI
  const userMsg = document.createElement("div");
  userMsg.classList.add("user");
  userMsg.innerText = rawText;
  chatBox.appendChild(userMsg);

  scrollToBottom();

  if (welcomeScreen) {
    welcomeScreen.classList.add("hide");
  }

  input.value = "";
  input.style.height = "40px";

  // bot message UI
  const botMsg = document.createElement("div");
  botMsg.classList.add("bot");
  botMsg.innerText = "Thinking...";
  chatBox.appendChild(botMsg);

  scrollToBottom();

  sendBtn.style.display = "none";
  stopBtn.style.display = "block";
  stopWriting = false;

  setTimeout(async () => {

    const reply = await getGeminiAnswer(rawText);

    botMsg.innerText = "";

    let i = 0;

    const typing = setInterval(() => {

      if (stopWriting) {
        clearInterval(typing);
        stopBtn.style.display = "none";
        sendBtn.style.display = "block";
        return;
      }

      if (i < reply.length) {
        botMsg.innerText += reply.charAt(i);
        i++;
        scrollToBottom();
      } else {
        clearInterval(typing);
        stopBtn.style.display = "none";
        sendBtn.style.display = "block";
      }

    }, 20);

  }, 1000);
}

/* =========================
   Stop Button
========================= */

stopBtn.addEventListener("click", () => {
  stopWriting = true;
});

//-------------------------------------------------------------------//


const menu = document.getElementById("menu");

const openBtn = document.getElementById("openBtn");

const closeBtn = document.getElementById("closeBtn");

const  MENU = document.getElementById("ptn");

openBtn.addEventListener("click", () => {

    menu.classList.add("show");

});

closeBtn.addEventListener("click", () => {

    menu.classList.remove("show");

});

ptn.addEventListener("click", () => {

    menu.classList.remove("show");

});

document.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && !openBtn.contains(e.target)) {
        menu.classList.remove("show");
    }
});



//--------------------------------------------------------------------//

btn.onclick = (e) => {
    e.stopPropagation();
    box.classList.toggle("show");
}

box.onclick = (e) => {
    e.stopPropagation();
}

document.onclick = () => {
    box.classList.remove("show");
}

//-------------------------------------------------------------------//

document.addEventListener("DOMContentLoaded", () => {

  const themeLink = document.getElementById("theme");
  const radios = document.querySelectorAll('input[name="theme"]');

  function getSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function setTheme(mode) {
    if (!themeLink) {
      console.error("❌ مش لاقي link id='theme'");
      return;
    }

    themeLink.href = mode + ".css";

    const btn = document.getElementById(mode + "Btn");
    if (btn) btn.checked = true;
  }

  setTheme(getSystemTheme());

  radios.forEach(radio => {
    radio.addEventListener("change", () => {
      setTheme(radio.value);
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {

  const themeLink = document.getElementById("theme");
  const radios = document.querySelectorAll('input[name="theme"]');

  function setTheme(mode, save = true) {
    themeLink.href = mode + ".css";
    document.getElementById(mode + "Btn").checked = true;

    if (save) {
      localStorage.setItem("theme", mode);
    }
  }

  const savedTheme = localStorage.getItem("theme");

  if (savedTheme) {
    setTheme(savedTheme, false);
  } else {

    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

    setTheme(systemTheme, false);
  }

  radios.forEach(radio => {
    radio.addEventListener("change", () => {
      setTheme(radio.value, true);
    });
  });

});

//----------------------------------------------------------------------------//

document.getElementById("ptn").addEventListener("click", () => {

  const users = document.querySelectorAll(".user");
  const bots = document.querySelectorAll(".bot");

  const emptyChat = document.getElementById("emptyChat");

  users.forEach(el => el.classList.add("fade-out"));
  bots.forEach(el => el.classList.add("fade-out"));

  setTimeout(() => {

    users.forEach(el => el.remove());
    bots.forEach(el => el.remove());

    if (emptyChat) {
      emptyChat.style.display = "block";
      emptyChat.style.opacity = "1";
      emptyChat.style.visibility = "visible";
    }

  }, 300);

});

//---------------------------------------------------------------------------//

document.getElementById("ptn").addEventListener("click", () => {

  document.body.style.opacity = "0";

  setTimeout(() => {
    location.reload();
  }, 300);

});

//--------------------------------------------------------------------------//

const menu2 = document.getElementById("box3");
const openBtn2 = document.getElementById("btnlogin1");
const closeBtn2 = document.getElementById("btnclose");

openBtn2.addEventListener("click", () => {
    menu2.classList.add("show");
});

closeBtn2.addEventListener("click", () => {
    menu2.classList.remove("show");
});

document.addEventListener("click", (e) => {
    if (
        !menu2.contains(e.target) &&
        !openBtn2.contains(e.target)
    ) {
        menu2.classList.remove("show");
    }
});

//-----------------------------------------------------------------------------//

const btnnn = document.getElementById("btnnn");
const boxe = document.getElementById("box5");

btnnn.addEventListener("click", (e) => {
  e.stopPropagation();
  boxe.classList.toggle("show");
});
document.addEventListener("click", () => {
  boxe.classList.remove("show");
});

//-------------------------------------------------------------//

const colors = ["blue", "green", "yellow", "pink", "orange"];

function mark(btn) {
  localStorage.setItem("selectedBtn", btn.id);
  setCheck(btn.id);

  switch (btn.id) {
    case "btn1":
      resetAll();
      break;

    case "color2":
      blue();
      break;

    case "color3":
      green();
      break;

    case "color4":
      yellow();
      break;

    case "color5":
      pink();
      break;

    case "color6":
      orange();
      break;
  }
}

function blue() {
  clearColors();
  document.getElementById('sendBtn').style.background = 'rgb(13, 98, 226)';
  document.getElementById('svg3').style.stroke = "rgb(203, 211, 218)";
  document.getElementById('ptn').style.background = "rgb(13, 98, 226)";
  document.getElementById('hh3').style.color = "rgb(203, 211, 218)";
  document.getElementById('svg1').style.fill = "rgb(203, 211, 218)";
  document.getElementById('hh3').style.textShadow = "none";
  document.getElementById('ptn').style.border = "none";
  document.getElementById('stop').style.background = "rgb(203, 211, 218)";
  document.getElementById('stopBtn').style.background = "rgb(13, 98, 226)";
  document.getElementById('input').style.caretColor = "rgb(13, 98, 226)";
}

function green() {
  clearColors();
  document.getElementById('sendBtn').style.background = 'rgb(13, 109, 13)';
  document.getElementById('svg3').style.stroke = "rgb(203, 211, 218)";
  document.getElementById('ptn').style.background = "rgb(13, 109, 13)";
  document.getElementById('hh3').style.color = "rgb(203, 211, 218)";
  document.getElementById('svg1').style.fill = "rgb(203, 211, 218)";
  document.getElementById('hh3').style.textShadow = "none";
  document.getElementById('ptn').style.border = "none";
  document.getElementById('stop').style.background = "rgb(203, 211, 218)";
  document.getElementById('stopBtn').style.background = "rgb(13, 109, 13)";
  document.getElementById('input').style.caretColor = "rgb(13, 109, 13)";
}

function yellow() {
  clearColors();
  document.getElementById('sendBtn').style.background = 'rgb(251, 255, 0)';
  document.getElementById('svg3').style.stroke = "black";
  document.getElementById('ptn').style.background = "rgb(251, 255, 0)";
  document.getElementById('hh3').style.color = "black";
  document.getElementById('svg1').style.fill = "black";
  document.getElementById('hh3').style.textShadow = "none";
  document.getElementById('ptn').style.border = "none";
  document.getElementById('stop').style.background = "black";
  document.getElementById('stopBtn').style.background = "rgb(251, 255, 0)";
  document.getElementById('input').style.caretColor = "rgb(251, 255, 0)";
}

function pink() {
  clearColors();
  document.getElementById('sendBtn').style.background = 'pink';
  document.getElementById('svg3').style.stroke = "black";
  document.getElementById('ptn').style.background = "pink";
  document.getElementById('hh3').style.color = "black";
  document.getElementById('svg1').style.fill = "black";
  document.getElementById('hh3').style.textShadow = "none";
  document.getElementById('ptn').style.border = "none";
  document.getElementById('stop').style.background = "black";
  document.getElementById('stopBtn').style.background = "pink";
  document.getElementById('input').style.caretColor = "pink";
}
function orange() {
  clearColors();
  document.getElementById('sendBtn').style.background = 'orange';
  document.getElementById('svg3').style.stroke = "black";
  document.getElementById('ptn').style.background = "orange";
  document.getElementById('hh3').style.color = "black";
  document.getElementById('svg1').style.fill = "black";
  document.getElementById('hh3').style.textShadow = "none";
  document.getElementById('ptn').style.border = "none";
  document.getElementById('stop').style.background = "black";
  document.getElementById('stopBtn').style.background = "orange";
  document.getElementById('input').style.caretColor = "orange";
}

function resetAll() {
  clearColors();
}

function clearColors() {
  document.body.classList.remove(...colors);
}

function setCheck(id) {
  document.querySelectorAll(".check").forEach(e => e.remove());

  const btn = document.getElementById(id);
  if (!btn) return;

  const span = document.createElement("span");
  span.className = "check";
  span.innerHTML = "✔";

  btn.appendChild(span);
}

window.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("selectedBtn") || "btn1";

  setCheck(saved);

  const fakeBtn = { id: saved };
  mark(fakeBtn);
});
document.getElementById("btn1").addEventListener("click", () => {
  location.reload();
});

//----------------------------------------------------------------------------//
