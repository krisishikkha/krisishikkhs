const urlParams = new URLSearchParams(window.location.search);
const examId = urlParams.get("exam");

if (!examId || !EXAM_STATUS[examId]) {
  document.body.innerHTML = "<h2>Exam Not Found</h2>";
  throw new Error("Invalid Exam");
}

const status = EXAM_STATUS[examId].status;
document.getElementById("examTitle").innerText =
  EXAM_STATUS[examId].title;

if (status !== "live") {
  document.getElementById("lockedMessage").classList.remove("hidden");
  document.getElementById("timerBox").style.display = "none";
  throw new Error("Exam Locked");
}

// প্রশ্ন লোড
const script = document.createElement("script");
script.src = `exam-corner/${examId}/questions.js`;
document.body.appendChild(script);

script.onload = function () {
  renderQuestions();
  startTimer();   // ✅ Timer শুরু এখানেই
};

function renderQuestions() {
  const container = document.getElementById("examContainer");

  QUESTIONS.forEach((q, index) => {
    const div = document.createElement("div");
    div.classList.add("card");

    div.innerHTML = `
      <h4>প্রশ্ন ${index + 1}: ${q.question}</h4>
      ${q.options.map((opt, i) =>
        `<button onclick="selectAnswer(${index}, ${i}, this)">
          ${opt}
        </button><br>`
      ).join("")}
    `;

    container.appendChild(div);
  });
}

let timeLeft = 25 * 60;
let timerInterval;
let userAnswers = [];

function startTimer() {
  const timerDisplay = document.getElementById("timer");

  timerInterval = setInterval(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    timerDisplay.textContent =
      `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

    timeLeft--;

    if (timeLeft < 0) {
      clearInterval(timerInterval);
      submitExam();
    }
  }, 1000);
}

function selectAnswer(qIndex, optIndex, btn) {
  const buttons = btn.parentElement.querySelectorAll("button");
  buttons.forEach(b => b.disabled = true);

  userAnswers[qIndex] = optIndex;
}

function submitExam() {
  clearInterval(timerInterval);

  let score = 0;

  QUESTIONS.forEach((q, index) => {
    if (userAnswers[index] === q.answer) {
      score++;
    }
  });

  const percentage = (score / QUESTIONS.length) * 100;
  const result = percentage >= 40 ? "PASS ✅" : "FAIL ❌";

  document.body.innerHTML = `
    <div style="text-align:center; margin-top:50px;">
      <h2>Exam Finished</h2>
      <h3>Score: ${score} / ${QUESTIONS.length}</h3>
      <h3>Percentage: ${percentage.toFixed(2)}%</h3>
      <h2>${result}</h2>
    </div>
  `;
}
