import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);

  useEffect(() => {
    axios
      .get('https://opentdb.com/api.php?amount=50&category=9')
      .then((response) => {
        setQuestions(response.data.results.slice(0, 5));
      });
  }, []);

  const handleAnswerButtonClick = (answer) => {
    const isCorrect = answer === questions[currentQuestion].correct_answer;
    setUserAnswers((prevUserAnswers) => [
      ...prevUserAnswers,
      {
        question: questions[currentQuestion].question,
        userAnswer: answer,
        isCorrect,
      },
    ]);
    if (isCorrect) {
      setScore(score + 1);
    }
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setTimeout(() => {
        setCurrentQuestion(nextQuestion);
      }, 1000);
    } else {
      setShowScore(true);
    }
  };

  const NewGameButtonClick = () => {
    setQuestions([]);
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setUserAnswers([]);
    axios
      .get('https://opentdb.com/api.php?amount=50&category=9')
      .then((response) => {
        setQuestions(response.data.results.slice(0, 5));
      });
  };

  if (questions.length === 0) {
    return <div>Učitavanje pitanja...</div>;
  }


  const getAnswerButtonClassName = (answer) => {
    if (
      answer === questions[currentQuestion].correct_answer &&
      userAnswers.find(
        (userAnswer) =>
          userAnswer.question === questions[currentQuestion].question &&
          userAnswer.userAnswer === answer
      )
    ) {
      return 'correct-answer';
    }
    if (
      userAnswers.find(
        (userAnswer) =>
          userAnswer.question === questions[currentQuestion].question &&
          userAnswer.userAnswer === answer
      )
    ) {
      return 'wrong-answer';
    }
    return '';
  };



  return (
    <div className="quiz-container">
      {showScore ? (
        <div className="score-section">
          <h2>Tvoj konačni rezultat je: {score}/{questions.length}</h2>

          <button onClick={NewGameButtonClick}>Nova igra</button>
        </div>
      ) : (
        <>
          <div className="question-section">
            <div className="question-count">
              <span>Question {currentQuestion + 1}</span>/{questions.length}
            </div>
            <div className="question-text">
              {questions[currentQuestion].question}
            </div>
          </div>
          <div className="answer-section">
            {questions[currentQuestion].incorrect_answers.map((answer) => (

              <button
                key={answer}
                className={`answer-button ${getAnswerButtonClassName(answer)}`}
                disabled={
                  userAnswers.find(
                    (userAnswer) =>
                      userAnswer.question === questions[currentQuestion].question &&
                      userAnswer.userAnswer === answer
                  )
                }
                onClick={() => handleAnswerButtonClick(answer)}
              >

                {answer}
              </button>
            ))}

            <button
              key={questions[currentQuestion].correct_answer}
              className={`answer-button ${getAnswerButtonClassName(
                questions[currentQuestion].correct_answer
              )}`}
              disabled={
                userAnswers.find(
                  (userAnswer) =>
                    userAnswer.question === questions[currentQuestion].question &&
                    userAnswer.userAnswer === questions[currentQuestion].correct_answer
                )
              }
              onClick={() =>
                handleAnswerButtonClick(questions[currentQuestion].correct_answer)
              }
            >

              {questions[currentQuestion].correct_answer}
            </button>
          </div>
          <div className="score-section">
            <p>Tvoj rezultat je: {score}</p>
          </div>
        </>
      )}
    </div>
  )
}
export default Quiz
