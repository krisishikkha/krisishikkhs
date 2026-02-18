let userAnswers = [];
let timeLeft = 25 * 60;
let timerInterval;

function validateAccess() {

  const name = document.getElementById("studentName").value.trim();
  const code = document.getElementById("accessCode").value.trim();
  const warning = document.getElementById("warning");

  if (name === "") {
    warning.innerText = "নাম লিখুন";
    return;
  }

  if (code !== "krisi1") {
    warning.innerText = "ভুল এক্সেস কোড";
    return;
  }

  document.getElementById("loginSection").style.display = "none";
  document.getElementById("examMain").style.display = "block";

  initExam();
}

function initExam() {

  const params = new URLSearchParams(window.location.search);
  const examId = params.get("exam");

  if (!examId || !EXAM_STATUS[examId]) {
    document.body.innerHTML = "<h2>Invalid Exam ID</h2>";
    return;
  }

  if (EXAM_STATUS[examId].status !== "live") {
    document.body.innerHTML = "<h2>Exam Locked</h2>";
    return;
  }

  document.getElementById("examTitle").innerText =
    EXAM_STATUS[examId].title;

  renderQuestions();
  startTimer();
}

function renderQuestions() {

  const container = document.getElementById("examContainer");
  container.innerHTML = "";

  QUESTIONS.forEach((q, index) => {

    const div = document.createElement("div");
    div.innerHTML = `
      <h4>${index + 1}. ${q.question}</h4>
      ${q.options.map((opt, i) =>
        `<button onclick="selectAnswer(${index}, ${i}, this)">
            ${opt}
         </button><br>`
      ).join("")}
      <br>
    `;

    container.appendChild(div);
  });
}

function selectAnswer(qIndex, optIndex, btn) {

  if (userAnswers[qIndex] !== undefined) return;

  userAnswers[qIndex] = optIndex;

  const buttons = btn.parentElement.querySelectorAll("button");
  buttons.forEach(b => b.disabled = true);
}

function startTimer() {

  const timeDisplay = document.getElementById("timeLeft");

  timerInterval = setInterval(() => {

    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;

    timeDisplay.innerText =
      `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

    timeLeft--;

    if (timeLeft < 0) {
      clearInterval(timerInterval);
      submitExam();
    }

  }, 1000);
}

function submitExam() {

  clearInterval(timerInterval);

  let score = 0;

  QUESTIONS.forEach((q, index) => {
    if (userAnswers[index] === q.answer) {
      score++;
    }
  });

  document.getElementById("examMain").innerHTML =
    `<h2>পরীক্ষা শেষ</h2>
     <h3>আপনার নম্বর: ${score} / ${QUESTIONS.length}</h3>`;
}
