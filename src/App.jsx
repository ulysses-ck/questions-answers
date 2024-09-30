import { useState } from "react";

function App() {
  const questions = [
    {
      question: "What is the capital of France?",
      answers: [
        { text: "New York", correct: false },
        { text: "London", correct: false },
        { text: "Paris", correct: true },
        { text: "Dublin", correct: false },
      ],
    },
    {
      question: "Who is CEO of Tesla?",
      answers: [
        { text: "Jeff Bezos", correct: false },
        { text: "Elon Musk", correct: true },
        { text: "Bill Gates", correct: false },
        { text: "Tony Stark", correct: false },
      ],
    },
    {
      question: "The iPhone was created by which company?",
      answers: [
        { text: "Apple", correct: true },
        { text: "Intel", correct: false },
        { text: "Amazon", correct: false },
        { text: "Microsoft", correct: false },
      ],
    },
    {
      question: "How many Harry Potter books are there?",
      answers: [
        { text: "1", correct: false },
        { text: "4", correct: false },
        { text: "6", correct: false },
        { text: "7", correct: true },
      ],
    },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);

  return (
    <main>
      <form>
        {questions.map((question, idxQuestion) => {
          return (
            <label key={idxQuestion}>
              <h2>{question.question}</h2>
              {question.answers.map((answer, idxAnswer) => {
                return (
                  <label key={idxAnswer}>
                    <input
                      type="radio"
                      name={`question-${idxQuestion}`}
                      value={answer.text}
                    />
                    {answer.text}
                  </label>
                );
              })}
            </label>
          );
        })}
      </form>
    </main>
  );
}

export default App;
