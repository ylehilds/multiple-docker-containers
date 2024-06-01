import React, { useEffect, useState } from 'react';
import './edit.css';

export function Edit() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [title, setTitle] = useState('');
  const [quizId, setQuizId] = useState(new URLSearchParams(window.location.search).get('quizId'));
  const [questions, setQuestions] = useState([]);


  useEffect(() => {
    if (!user) {
      window.location.href = '/';
    } else {
      fetchQuestions();
    }
  }, [user]);

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
      setTitle(res[0].title);
    }
  }

  const handleAddQuestion = () => {
    const newQuestion = {
      question: '',
      options: ['', '', '', ''],
      answerIndex: 0,
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleSaveQuestion = (index, question) => {
    const newQuestions = [...questions];
    newQuestions[index] = question;
    setQuestions(newQuestions);
  };

  const saveQuizToDB = async function () {
    const res = await fetch(`/api/quizzes/${quizId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ questions, title }),
    });
    if (res.status === 200) {
      console.log('save successful');
      alert('save successful');
    } else {
      alert('Error saving quiz.');
    }
  }

  const handleDeleteQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  return (
    <div>
      <input id="editQuizTitle" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Quiz Title" />
      <br />
      {questions.map((question, index) => (
        <QuestionEditor
          key={index}
          question={question}
          onSave={(newQuestion) => handleSaveQuestion(index, newQuestion)}
          onDelete={() => handleDeleteQuestion(index)}
        />
      ))}
      <br />
      <button className="btn btn-secondary add text-reset" onClick={handleAddQuestion}>Add Question</button>&nbsp;&nbsp;&nbsp;
      {/* // save buton to save entire quiz */}
      <button className="btn btn-secondary save text-reset" onClick={saveQuizToDB}>Save Quiz</button>
    </div>
  );
}

function QuestionEditor({ question, onSave, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newQuestion, setNewQuestion] = useState(question);

  const handleSave = () => {
    if (newQuestion.question === '' || newQuestion.options.some((option) => option === '')) {
      alert('Please fill in all fields.');
      return;
    }
    onSave(newQuestion);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNewQuestion(question);
    setIsEditing(false);
  };

  return (
    <div>
      {isEditing ? (
        <div>
          {/* Edit form */}
          <input value={newQuestion.question} onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })} placeholder="Question" />
          {newQuestion.options.map((option, index) => (
            <input
              key={index}
              value={option}
              onChange={(e) => {
                const newOptions = [...newQuestion.options];
                newOptions[index] = e.target.value;
                setNewQuestion({ ...newQuestion, options: newOptions });
              }}
              placeholder={`Option ${index + 1}`}
            />
          ))}
          <br />
          <select value={newQuestion.answerIndex} onChange={(e) => setNewQuestion({ ...newQuestion, answerIndex: parseInt(e.target.value) })}>
            <option value="0">Option 1</option>
            <option value="1">Option 2</option>
            <option value="2">Option 3</option>
            <option value="3">Option 4</option>
          </select>
          <br />
          <button className="btn btn-secondary save text-reset" onClick={handleSave}>Save</button>&nbsp;&nbsp;&nbsp;
          <button className="btn btn-secondary cancel text-reset" onClick={handleCancel}>Cancel</button>
        </div>
      ) : (
        <div>
          {/* Display */}
          <br />
          <div>{question.question}</div>
          <br />
          <button className="btn btn-secondary edit text-reset" onClick={() => setIsEditing(true)}>Edit</button>&nbsp;&nbsp;&nbsp;
          <button className="btn btn-secondary delete text-reset" onClick={onDelete}>Delete</button>
          <br />
        </div>
      )}
    </div>
  );
}

