const API_URL = "https://quiz-app-0x1i.onrender.com/generate-quiz";

document.getElementById("generateBtn").addEventListener("click", async () => {
  const subject = document.getElementById("subject").value.trim();
  const quizContainer = document.getElementById("quizContainer");
  const resultBox = document.getElementById("resultBox");

  if (!subject) {
    quizContainer.innerHTML = `<p>Please enter a subject!</p>`;
    return;
  }

  quizContainer.innerHTML = `<div class="loader">Loading quiz on <strong>${subject}</strong>...</div>`;
  resultBox.innerHTML = "";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject })
    });

    const quiz = await response.json();
    quizContainer.innerHTML = "";

    // Group questions by marks
    const groups = {
      "1": [],
      "2": [],
      "3": []
    };

    quiz.forEach(q => {
      if (groups[q.marks]) {
        groups[q.marks].push(q);
      }
    });

    for (let mark of ["1", "2", "3"]) {
      const title = document.createElement("h3");
      title.textContent = `📘 ${mark}-mark Questions`;
      quizContainer.appendChild(title);

      groups[mark].forEach((q, i) => {
        const index = `${mark}_${i}`;
        const block = document.createElement("div");
        block.className = "quiz-question fade-in";
        block.innerHTML = `
          <p><strong>${q.question}</strong></p>
          ${q.options.map(opt =>
            `<label><input type="radio" name="${index}" value="${opt}"> ${opt}</label><br>`
          ).join("")}
        `;
        quizContainer.appendChild(block);
      });
    }

    // Add Submit button
    const submitBtn = document.createElement("button");
    submitBtn.textContent = "Submit Quiz";
    submitBtn.className = "submit-btn";
    submitBtn.onclick = () => calculateScore(quiz);
    quizContainer.appendChild(submitBtn);

  } catch (err) {
    quizContainer.innerHTML = `<p>❌ Failed to load quiz. Try again later.</p>`;
  }
});

function calculateScore(quiz) {
  let totalScore = 0;
  let correctCount = 0;

  quiz.forEach((q, i) => {
    const index = `${q.marks}_${groups[q.marks].indexOf(q)}`;
    const selected = document.querySelector(`input[name="${index}"]:checked`);
    if (selected && selected.value === q.answer) {
      totalScore += q.marks;
      correctCount++;
    }
  });

  document.getElementById("resultBox").innerHTML = `
    <h3>🎉 Your Result</h3>
    <p>You got <strong>${correctCount}</strong> correct answers.</p>
    <p>Total Score: <strong>${totalScore}</strong> points</p>
  `;
}
