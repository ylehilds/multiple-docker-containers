import React, { useEffect, useState } from 'react';
import './quiz.css';

// Event messages
const QuizEndEvent = 'quizEnd';
const QuizStartEvent = 'quizStart';
let socket

export function Quiz() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [quizId, setQuizId] = useState(new URLSearchParams(window.location.search).get('quizId'));
  const [questions, setQuestions] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [userAnswers, setUserAnswers] = useState(new Array(questions.length).fill(null));
  const [score, setScore] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (!user) {
      window.location.href = '/';
    } else {
      fetchQuestions();
      configureWebSocket();
    }
  }, [user]);

  function handleAnswerChange(questionIndex, answerIndex) {
    setUserAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[questionIndex] = answerIndex;
      return newAnswers;
    });
  }

  async function fetchQuestions() {
    const response = await fetch(`/api/quizzes/${quizId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.status === 200) {
      const res = await response.json()
      setQuestions(res[0].questions);
      const myQuestions = adjustFormatQuestions(res)
      createQuiz(myQuestions);
      displaySlide(currentSlide);
    }
  }

  // ... other functions ...

  // Functionality for peer communication using WebSocket

  function configureWebSocket() {
    const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
    socket = new WebSocket(`${protocol}://${window.location.host}/ws`);
    socket.onopen = (event) => {
      displayMsg('system', 'quiz', 'connected');
    };
    socket.onclose = (event) => {
      displayMsg('system', 'quiz', 'disconnected');
    };
    socket.onmessage = async (event) => {
      const msg = JSON.parse(await event.data.text());
      if (msg.type === QuizEndEvent) {
        displayMsg('player', msg.from, `scored ${msg.value}`);
      } else if (msg.type === QuizStartEvent) {
        displayMsg('player', msg.from, `started a new quiz`);
      }
    };
  }

  function displayMsg(cls, from, msg) {
    const chatText = document.querySelector('#players-actions ul');
    chatText.innerHTML =
      `<li class="list-group-item"><span class="${cls}-event">${from}</span> ${msg}</div>` + chatText.innerHTML;
  }

  function broadcastEvent(from, type, value) {
    const event = {
      from: from,
      type: type,
      value: value,
    };

    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(event));
    } else {
      socket.addEventListener('open', () => {
        socket.send(JSON.stringify(event));
      });
    }
  }

  // Helper functions
  function mapIndexToLetter(index) {
    switch (index) {
      case 0:
        return 'a';
      case 1:
        return 'b';
      case 2:
        return 'c';
      case 3:
        return 'd';
    }
  }

  function revealResults() {
    let numCorrect = 0;

    questions.forEach((currentQuestion, questionNumber) => {
      const userAnswer = userAnswers[questionNumber];
      if (userAnswer === currentQuestion.answerIndex) {
        numCorrect++;
      }
    });

    setScore(numCorrect); // <-- Update the score state

    const scoreObject = {
      quizId,
      score: numCorrect,
      username: user.userId
    }

    submitScore(user.id, scoreObject);

    // Let other players know the quiz has concluded
    broadcastEvent(user.userId, QuizEndEvent, numCorrect);

    alert('Quiz submitted successfully!');
    setIsSubmitted(true); // <-- Add this line
  }

  async function submitScore(userId, score) {
    const response = await fetch(`/api/${userId}/score`, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(score), // body data type must match "Content-Type" header
    })
      .catch((error) => {
        console.error("Error:", error);
      });
    // Store what the service gave us as the high scores
    const scores = await response.json();
    return scores // parses JSON response into native JavaScript objects 
  }

  function displaySlide(n) {
    setCurrentSlide(n);
  }

  function createQuiz(myQuestions) {
    const output = [];

    myQuestions.forEach(
      (currentQuestion, questionNumber) => {

        const answers = [];

        for (var letter in currentQuestion.answers) {

          answers.push(
            `<label>
                  <input type="radio" name="question${questionNumber}" value="${letter}">
                  ${letter} :
                  ${currentQuestion.answers[letter]}
                </label>`
          );
        }

        output.push(
          `<div class="slide">
                <div class="question"> ${currentQuestion.question} </div>
                <div class="answers"> ${answers.join("")} </div>
              </div>`
        );
      }
    );

    // if (quizContainer) quizContainer.innerHTML = output.join('');

    // Let other players know a new quiz has started
    broadcastEvent(user.userId, QuizStartEvent, {});
  }

  function displayNextSlide() {
    displaySlide(currentSlide + 1);
  }

  function adjustFormatQuestions(questions) {
    const quizQuestions = questions;
    const myQuizQuestions = quizQuestions[0].questions;
    let myQuestions = [];

    myQuizQuestions.forEach((question, index) => {
      const adjustFormatQuestion = {
        question: question.question,
        answers: {
          a: question.options[0],
          b: question.options[1],
          c: question.options[2],
          d: question.options[3]
        },
        correctAnswer: mapIndexToLetter(question.answerIndex)
      }
      myQuestions.push(adjustFormatQuestion)
    })

    return myQuestions;
  }

  function submitQuiz() {
    revealResults();
  }

  return (
    <div className='main-quiz container-fluid text-center'>
      <div className="quiz-container">
        <div id="quiz">
          {questions.map((question, index) => (
            <div key={index} className={`slide ${currentSlide === index ? 'active-slide' : ''}`}>
              <div className="question">{question.question}</div>
              <div className={`answers ${isSubmitted ? (userAnswers[index] === question.answerIndex ? 'correct' : 'incorrect') : ''}`}>
                {question.options.map((option, i) => (
                  <label key={i}>
                  <input type="radio" name={`question${index}`} value={i} onChange={() => handleAnswerChange(index, i)} />
                  {option}
                </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {isSubmitted && (
        <div className="results">
          <br />
          <br />
          {score} out of {questions.length}
        </div>
      )}
      <br />
      <div id="quizNavigation">
        {currentSlide > 0 && <button className="btn btn-primary text-reset" onClick={() => setCurrentSlide(currentSlide - 1)}>Previous</button>}&nbsp;
        {currentSlide < questions.length - 1 && <button  className="btn btn-primary text-reset" onClick={() => setCurrentSlide(currentSlide + 1)}>Next</button>}
        {currentSlide === questions.length - 1 && <button className="btn btn-primary text-reset" onClick={submitQuiz}>Submit</button>}
        <div id="results"></div>
      </div>
      <br />
      <div id="players-actions">
        <br />
        <ul className="list-group">
        </ul>
      </div>
    </div>
  );
}
