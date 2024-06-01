import React, { useEffect, useState } from 'react';
import './create.css';

export function Create() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [quizId, setQuizId] = useState(uuidv4());
  const [questionList, setQuestionList] = useState([]);

  useEffect(() => {
    // Redirect to login page if user is not authenticated
    if (!user) {
      window.location.href = '/';
    }
  }, [user]);

  // const questionList = [];

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const quizTitle = document.getElementById('quizTitle').value;
    const question = {
      question: document.getElementById('question').value,
      options: [
        document.getElementById('option1').value,
        document.getElementById('option2').value,
        document.getElementById('option3').value,
        document.getElementById('option4').value,
      ],
      answerIndex: parseInt(document.getElementById('answer').value.slice(-1)) - 1,
    };
    const li = (
      <li key={uuidv4()}>
        <h3>{question.question}</h3>
        <ul>
          {question.options.map((option, index) => (
            <li key={index}>{option}</li>
          ))}
        </ul>
        <button className="delete-button" onClick={() => deleteQuestion(li)}>Delete</button>
      </li>
    );
    // questionList.push(li);
    setQuestionList(prevQuestions => [...prevQuestions, question]);

    // document.getElementById('question-list').appendChild(li);
    const inputToSkip = document.getElementById('quizTitle');
    const currentValue = inputToSkip.value;
    document.getElementById('question-form').reset();
    inputToSkip.value = currentValue;
    await saveQuestion(question, quizId, quizTitle);
  };

  const deleteQuestion = (index) => {
    setQuestionList(prevQuestions => prevQuestions.filter((_, i) => i !== index));
  };

  const saveQuestion = async (question, quizId, quizTitle) => {
    const response = await fetch('/api/quizzes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question, quizTitle, quizId, user }),
    });
    if (response.status === 201) {
      const res = await response.json()
      console.log(response);
    } else {
      alert('Error creating quiz/question.');
    }
  };

  function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  const handleClearButtonClick = () => {
    const form = document.getElementById('question-form');
    const inputToSkip = document.getElementById('quizTitle');
    const currentValue = inputToSkip.value;
    form.reset();
    inputToSkip.value = currentValue;
  };

  return (
    <div className="main-quiz container-fluid text-center">
      <br />
      <div className="quiz-frame">
        <div className="row">
          <div className="col-md-6">
            <form id="question-form" className="form-group" onSubmit={handleFormSubmit}>
              <br />
              <input className="form-control" type="text" placeholder="Quiz Title" id="quizTitle" name="quizTitle" required />
              <br />
              <input type="text" placeholder="Question" id="question" name="question" className="form-control" required />
              <br />
              <input type="text" id="option1" name="option1" placeholder="Option 1" className="form-control" required />
              <br />
              <input type="text" id="option2" name="option2" placeholder="Option 2" className="form-control" required />
              <br />
              <input type="text" id="option3" name="option3" placeholder="Option 3" className="form-control" required />
              <br />
              <input type="text" id="option4" name="option4" placeholder="Option 4" className="form-control" required />
              <br />
              <label htmlFor="answer" className="form-label">Answer:</label>
              <select id="answer" name="answer" className="form-select" required>
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
                <option value="option4">Option 4</option>
              </select>
              <br />
              <div className="d-flex justify-content-between">
                <button type="submit" className="btn btn-primary text-reset">Add Question</button>
                <button type="button" id="clear-button" className="btn btn-warning text-reset" onClick={handleClearButtonClick}>Clear</button>
                <br /><br />
              </div>
            </form>
            <br />
          </div>
          <div className="col-md-6">
            <ul id="question-list" className="list-group">
              {questionList.map((question, index) => (
                <li key={index}>
                  <h3>{question.question}</h3>
                  <ul>
                    {question.options.map((option, index) => (
                      <li key={index}>{option}</li>
                    ))}
                  </ul>
                  <button className="delete-button" onClick={() => deleteQuestion(index)}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
