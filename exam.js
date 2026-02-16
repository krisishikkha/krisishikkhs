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
    div.className = "card";   // IMPORTANT

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

    // যদি আগেই উত্তর দেওয়া থাকে তাহলে আর কিছু করবে না (LOCK)
    if (userAnswers[qIndex] !== undefined) return;

    const buttons = btn.parentElement.querySelectorAll("button");

    // সব বাটন disable করে দিবে
    buttons.forEach(b => {
        b.disabled = true;
        b.classList.remove("selected");
    });

    // যেটা সিলেক্ট করা হয়েছে সেটা highlight করবে
    btn.classList.add("selected");

    userAnswers[qIndex] = optIndex;
}

// ================= TIMER =================

let totalTime = 25 * 60;

function startTimer() {
    const timerBox = document.querySelector(".timer-box");
    const timeDisplay = document.getElementById("timeLeft");

    timerInterval = setInterval(function () {

        let minutes = Math.floor(totalTime / 60);
        let seconds = totalTime % 60;

        seconds = seconds < 10 ? "0" + seconds : seconds;

        timeDisplay.innerText = minutes + ":" + seconds;

        if (totalTime <= 300 && totalTime > 120) {
            timerBox.classList.add("timer-warning");
        }

        if (totalTime <= 120) {
            timerBox.classList.remove("timer-warning");
            timerBox.classList.add("timer-danger");
        }

        if (totalTime <= 0) {
            clearInterval(timerInterval);
            alert("সময় শেষ! পরীক্ষা অটো সাবমিট হচ্ছে...");
            submitExam();
        }

        totalTime--;

    }, 1000);
}

// ================= SUBMIT =================

function submitExam() {

    clearInterval(timerInterval);

    let score = 0;
    let wrong = 0;
    let unanswered = 0;

    QUESTIONS.forEach((q, index) => {
        if (userAnswers[index] === q.answer) {
            score++;
        } else if (userAnswers[index] === undefined) {
            unanswered++;
        } else {
            wrong++;
        }
    });

    // 🔥 Auto Scroll Top
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    const container = document.getElementById("examMain");

    container.innerHTML = `
        <div class="scoreboard-card">
            <h2>📊 Scoreboard</h2>
            <h3>${document.getElementById("examTitle").innerText}</h3>
            <p><strong>মোট প্রশ্ন:</strong> ${QUESTIONS.length}</p>
            <p><strong>সঠিক:</strong> ${score}</p>
            <p><strong>ভুল:</strong> ${wrong}</p>
            <p><strong>Unanswered:</strong> ${unanswered}</p>
        </div>

        <div id="reviewSection"></div>
    `;

    const reviewSection = document.getElementById("reviewSection");

    QUESTIONS.forEach((q, index) => {

        const userAns = userAnswers[index];
        const correctAns = q.answer;

        let statusColor = "#999";

        if (userAns === correctAns) {
            statusColor = "green";
        } else if (userAns === undefined) {
            statusColor = "orange";
        } else {
            statusColor = "red";
        }

        const div = document.createElement("div");
        div.className = "review-card";

        div.innerHTML = `
            <h4>Q${index + 1}: ${q.question}</h4>
            <p><strong>আপনার উত্তর:</strong> 
                <span style="color:${statusColor}">
                    ${userAns !== undefined ? q.options[userAns] : "উত্তর দেননি"}
                </span>
            </p>
            <p><strong>সঠিক উত্তর:</strong> ${q.options[correctAns]}</p>
            <p><strong>ব্যাখ্যা:</strong> ${q.explanation ? q.explanation : "ব্যাখ্যা নেই"}
            </p>
        `;

        reviewSection.appendChild(div);
    });
}
