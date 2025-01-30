import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function GamePage() {
  const { GName } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);

  const fetchGID = async () => {
    try {
      const response = await fetch(`http://localhost:5000/game/${GName}`);
      if (!response.ok) throw new Error(`Failed to fetch GID, status: ${response.status}`);
      const data = await response.json();
      return data.GID || Promise.reject("GID not found");
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const fetchOptions = async (qid) => {
    try {
      const response = await fetch(`http://localhost:5000/options/${qid}`);
      if (!response.ok) throw new Error(`Failed to fetch options for QID: ${qid}`);
      return await response.json();
    } catch (err) {
      setError(err.message);
      return [];
    }
  };

  const fetchQuestions = async (gid) => {
    try {
      const response = await fetch(`http://localhost:5000/questions/${gid}`);
      if (!response.ok) throw new Error(`Failed to fetch questions, status: ${response.status}`);
      const data = await response.json();

      const questionsWithOptions = await Promise.all(
        data.map(async (question) => {
          const options = await fetchOptions(question.QID);
          return { ...question, options };
        })
      );

      setQuestions(questionsWithOptions);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const gid = await fetchGID();
        await fetchQuestions(gid);
      } catch (err) {
        // Errors are already handled in fetch functions
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [GName]);

  const handleOptionSelect = (option) => {
    setSelectedAnswer(option);
  };

  const handleSubmit = () => {
    if (!selectedAnswer) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer.IsCorrect;
    const questionScore =
      currentQuestion.QDifficulty === "Easy" ? 1 :
      currentQuestion.QDifficulty === "Medium" ? 2 :
      currentQuestion.QDifficulty === "Hard" ? 3 : 0;

    if (isCorrect) {
      setScore(score + questionScore);
    }

    setUserAnswers([...userAnswers, { question: currentQuestion, answer: selectedAnswer }]);
    setAnswered(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setAnswered(false);
      setSelectedAnswer(null);
    } else {
      navigate("/feedback", { state: { score } });
    }
  };

  return (
    <div className="game-page">
      <nav className="navbar">
        <h1 className="navbar-heading">{GName}</h1>
      </nav>

      {isLoading ? (
        <p className="loading-text">Loading questions...</p>
      ) : error ? (
        <p className="error-text">Error: {error}</p>
      ) : (
        <div className="question-container">
          {Array.isArray(questions) && questions.length > 0 ? (
            <div className="question-box">
              <h3 className="question-text">{questions[currentQuestionIndex].Question}</h3>
              
              {/* Display question difficulty in the top-right corner */}
              <div className={`question-difficulty ${questions[currentQuestionIndex].QDifficulty.toLowerCase()}`}>
                {questions[currentQuestionIndex].QDifficulty}
              </div>


              <div className="options-container">
                {questions[currentQuestionIndex].options.map((option, index) => (
                  <div key={index} className="option">
                    <input
                      type="radio"
                      id={`option-${index}`} // Corrected here
                      name={`question-${questions[currentQuestionIndex].QID}`} // Corrected here
                      value={option.OID}
                      checked={selectedAnswer === option}
                      onChange={() => handleOptionSelect(option)}
                      disabled={answered}
                      className="option-radio"
                    />
                    <label htmlFor={`option-${index}`} className="option-label"> {/* Corrected here */}
                      {option.Option}
                    </label>
                  </div>
                ))}
              </div>

              <button
                onClick={answered ? handleNext : handleSubmit}
                className="action-button"
                disabled={!selectedAnswer}
              >
                {answered ? "Next" : "Submit"}
              </button>
            </div>
          ) : (
            <p className="no-questions-text">No questions available.</p>
          )}
        </div>
      )}

      {/* Show explanation in a separate div outside the question-container */}
      {answered && (
        <div className="question-desc">
          <h3>Explanation</h3>
          <p>{questions[currentQuestionIndex].QDesc}</p>
        </div>
      )}
    </div>
  );
}

export default GamePage;
