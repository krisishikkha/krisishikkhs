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
  throw new Error("Exam Locked");
}

// 🔥 Folder name updated here
const script = document.createElement("script");
script.src = `exam-corner/${examId}/questions.js`;
document.body.appendChild(script);

script.onload = function () {
  renderQuestions();
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

function selectAnswer(qIndex, optIndex, btn) {
  const buttons = btn.parentElement.querySelectorAll("button");
  buttons.forEach(b => b.disabled = true);
}
