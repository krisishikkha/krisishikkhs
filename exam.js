let userAnswers = [];
let timeLeft = 25 * 60;
let timerInterval;

// ================= LOGIN =================

function validateAccess() {
  const name = document.getElementById("studentName").value.trim();
  const code = document.getElementById("accessCode").value.trim();
  const warning = document.getElementById("warning");

  if (name === "") {
    warning.innerText = "নাম লিখুন।";
    return;
  }

  if (code !== "krisi1") {
    warning.innerText = "ভুল এক্সেস কোড!";
    return;
  }

  document.getElementById("loginSection").style.display = "none";
  document.getElementById("examMain").style.display = "block";

  initExam();
}

// ================= INIT EXAM =================

function initExam() {

  const urlParams = new URLSearchParams(window.location.search);
  const examId = urlParams.get("exam");

  if (!examId || !EXAM_STATUS[examId]) {
    document.body.innerHTML = "<h2>Exam Not Found</h2>";
    return;
  }

  document.getElementById("examTitle").innerText =
    EXAM_STATUS[examId].title;

  if (EXAM_STATUS[examId].status !== "live") {
    document.body.innerHTML = "<h2>Exam Locked</h2>";
    return;
  }

  // Load Questions
  const script = document.createElement("script");
  script.src = `exam-corner/${examId}/questions.js`;

  script.onload = function () {
    renderQuestions();
    startTimer();
  };

  document.body.appendChild(script);
}

// ================= RENDER QUESTIONS =================

function renderQuestions() {
  const container = document.getElementById("examContainer");

  QUESTIONS.forEach((q, index) => {

    const div = document.createElement("div");
    div.style.marginBottom = "20px";

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

// ================= SELECT ANSWER =================

function selectAnswer(qIndex, optIndex, btn) {
  const buttons = btn.parentElement.querySelectorAll("button");

  buttons.forEach(b => b.style.background = "");

  btn.style.background = "lightgreen";

  userAnswers[qIndex] = optIndex;
}

// ================= TIMER =================

function startTimer() {
  const timerDisplay = document.getElementById("timer");

  timerInterval = setInterval(() => {

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    timerDisplay.innerText =
      minutes + ":" + (seconds < 10 ? "0" + seconds : seconds);

    timeLeft--;

    if (timeLeft < 0) {
      clearInterval(timerInterval);
      submitExam();
    }

  }, 1000);
}

// ================= SUBMIT =================

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
