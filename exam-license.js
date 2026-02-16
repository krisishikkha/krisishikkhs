function validateAccess() {
    const name = document.getElementById("studentName").value.trim();
    const code = document.getElementById("accessCode").value.trim();
    const warning = document.getElementById("warning");

    // যদি নাম বা কোড খালি থাকে
    if (!name || !code) {
        warning.innerText = "নাম এবং এক্সেস কোড লিখুন";
        return;
    }

    // এখানে তুমি চাইলে নির্দিষ্ট কোড দিতে পারো
    const validCode = "1234";  // চাইলে পরিবর্তন করতে পারো

    if (code !== validCode) {
        warning.innerText = "ভুল এক্সেস কোড";
        return;
    }

    // Login Section hide
    document.getElementById("loginSection").style.display = "none";

    // Exam Section show
    document.getElementById("examMain").classList.remove("hidden");

    warning.innerText = "";
}
