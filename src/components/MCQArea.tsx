import React, { useState } from "react";
import { twMerge } from "tailwind-merge";

// Define the type for a single multiple-choice question
interface MCQ {
  id: number;
  question: string;
  options: string[];
  answer: number; // Zero-indexed correct answer
}

// Define the props type for the MCQArea component
interface MCQAreaProps {
  data: MCQ[];
}

const MCQArea: React.FC<MCQAreaProps> = ({ data }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [errorMsg, setErrorMsg] = useState("");

  // Handle option selection
  const handleOptionChange = (index: number) => {
    setSelectedOption(index);
    // Clear error message when user selects an option
    setErrorMsg("");
  };

  // Handle submit of answer
  const handleSubmit = () => {
    if (selectedOption === null) {
      setErrorMsg("Please select an option!");
      return;
    }

    // Check if selected option is correct
    if (selectedOption === data[currentQuestion].answer) {
      setFeedback("Correct!");
      setScore((prevScore) => ({
        ...prevScore,
        correct: prevScore.correct + 1,
      }));
    } else {
      setFeedback("Wrong!");
      setScore((prevScore) => ({
        ...prevScore,
        wrong: prevScore.wrong + 1,
      }));
    }
    setShowFeedback(true);
  };

  // Move to the next question or end the quiz
  const handleNext = () => {
    setSelectedOption(null);
    setFeedback(null);
    setShowFeedback(false);
    setErrorMsg(""); // Clear any error messages
    setCurrentQuestion((prev) => prev + 1);
  };

  // If all questions are answered, show results screen
  if (currentQuestion >= data?.length) {
    return (
      <div>
        <h2>Quiz Results</h2>
        <p>Correct Answers: {score.correct}</p>
        <p>Wrong Answers: {score.wrong}</p>
      </div>
    );
  }

  // Render current question
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">
        Question {currentQuestion + 1} of {data.length}
      </h2>
      <p className="text-xl">{data[currentQuestion].question}</p>
      <ul className="space-y-2">
        {data[currentQuestion].options.map((option, index) => (
          <li key={index}>
            <label className="flex items-baseline gap-2">
              <input
                type="radio"
                name={`question-${data[currentQuestion].id}`}
                value={index}
                checked={selectedOption === index}
                onChange={() => handleOptionChange(index)}
                disabled={showFeedback}
              />
              <div>
                {index + 1}) {option}
              </div>
            </label>
          </li>
        ))}
      </ul>
      {/* Display error message if exists */}
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      {!showFeedback ? (
        <button onClick={handleSubmit}>Submit</button>
      ) : (
        <div className="space-y-3">
          <p>
            <span
              className={twMerge(
                feedback === "Correct!" ? "text-green-500" : "text-red-500"
              )}
            >
              {feedback}
            </span>{" "}
            {feedback === "Wrong!" &&
              `correct answer is ${data[currentQuestion].answer + 1}`}
          </p>
          <button
            className="bg-primary_green px-2 py-1 rounded-sm font-semibold"
            onClick={handleNext}
          >
            {currentQuestion === data.length - 1
              ? "See Results"
              : "Next Question"}
          </button>
        </div>
      )}
    </div>
  );
};

export default MCQArea;
