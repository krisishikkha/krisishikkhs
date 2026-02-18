let userAnswers = [];
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
    div.classList.add("card");  // 👈 এইখানে বসাবি
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

  // আগে যদি ওই প্রশ্নের উত্তর দেওয়া থাকে, তাহলে আর কিছু করবে না
  if (userAnswers[qIndex] !== undefined) return;

  // উত্তর সেভ কর
  userAnswers[qIndex] = optIndex;

  // শুধু ওই প্রশ্নের বাটনগুলো নাও
  const buttons = btn.parentElement.querySelectorAll("button");

  // সব বাটন disable কর
  buttons.forEach(function(b) {
    b.disabled = true;
  });

  // যেটা ক্লিক করা হয়েছে সেটাতে selected class যোগ কর
  btn.classList.add("selected");
}

let totalTime = 25 * 60;

function startTimer() {

  const timerBox = document.querySelector(".timer-box");
  const timeDisplay = document.getElementById("timeLeft");

  timerInterval = setInterval(function () {

    let minutes = Math.floor(totalTime / 60);
    let seconds = totalTime % 60;

    seconds = seconds < 10 ? "0" + seconds : seconds;

    timeDisplay.innerText = minutes + ":" + seconds;

    // Last 5 minutes
    if (totalTime <= 300 && totalTime > 120) {
      timerBox.classList.add("timer-warning");
    }

    // Last 2 minutes
    if (totalTime <= 120) {
      timerBox.classList.remove("timer-warning");
      timerBox.classList.add("timer-danger");
    }

    if (totalTime <= 0) {
      clearInterval(timerInterval);
      submitExam();
    }

    totalTime--;

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
