document.getElementById("generateBtn").addEventListener("click", async () => {
  const subject = document.getElementById("subject").value;
  const quizContainer = document.getElementById("quizContainer");

  quizContainer.innerHTML = `<p>Loading questions for ${subject}...</p>`;

  // For now, simulate the response
  const dummyQuestions = [
    {
      question: "What is the capital of France?",
      options: ["Berlin", "Madrid", "Paris", "London"]
    },
    {
      question: "Which gas do plants absorb?",
      options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Helium"]
    }
  ];

  quizContainer.innerHTML = "";
  dummyQuestions.forEach((q, i) => {
    const block = document.createElement("div");
    block.innerHTML = `<p><strong>Q${i + 1}:</strong> ${q.question}</p>` +
      q.options.map(opt => `<label><input type="radio" name="q${i}"> ${opt}</label><br>`).join("");
    quizContainer.appendChild(block);
  });
});
