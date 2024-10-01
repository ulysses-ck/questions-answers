import { useState, useRef } from "react";

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

  const [currentQuestion, setCurrentQuestion] = useState(1);
  const formQuestions = useRef(null);

  const handlePreviousQuestion = () => {
    setCurrentQuestion((prevCurrentQuestion) => {
      if (prevCurrentQuestion === 1) {
        return questions.length;
      }

      return prevCurrentQuestion - 1;
    });
  };

  const handleNextQuestion = () => {
    setCurrentQuestion((prevCurrentQuestion) => {
      if (prevCurrentQuestion === questions.length) {
        return 1;
      }

      return prevCurrentQuestion + 1;
    });
  };

  const handleClickIsEnd = () => {
    setIsEnd(true);
  };

  const handleClickRestart = () => {
    setCurrentQuestion(0);
    setIsEnd(false);
    formQuestions.current.reset();
  };

  const [isEnd, setIsEnd] = useState(false);

  return (
    <main>
      <form ref={formQuestions}>
        {questions.map((question, idxQuestion) => {
          return (
            <label
              key={idxQuestion}
              style={{
                display: idxQuestion + 1 === currentQuestion ? "block" : "none",
              }}
            >
              <h2>{question.question}</h2>
              {question.answers.map((answer, idxAnswer) => {
                return (
                  <label key={idxAnswer}>
                    <input
                      type="radio"
                      name={`question-${idxQuestion}`}
                      value={answer.text}
                      disabled={isEnd}
                    />
                    {answer.text}
                  </label>
                );
              })}
            </label>
          );
        })}
      </form>
      <section>
        <button onClick={handlePreviousQuestion}>Previous</button>
        <span>
          {currentQuestion} / {questions.length}
        </span>
        <button onClick={handleNextQuestion}>Next</button>
        {currentQuestion - 1 === questions.length - 1 && !isEnd && (
          <button onClick={handleClickIsEnd}>Show results</button>
        )}

        {isEnd && <button onClick={handleClickRestart}>Restart</button>}
      </section>
    </main>
  );
}

export default App;
