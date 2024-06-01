import React, { useEffect, useState } from 'react';
import './dashboard.css';

export function Dashboard() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    if (!user) {
      window.location.href = '/';
    } else {
      fetchQuizzes();
    }
  }, [user]);

  async function fetchQuizzes() {
    const response = await fetch('/api/quizzes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.status === 200) {
      setQuizzes(await response.json());
    }
  }

  async function deleteQuiz(quizId) {
    const response = await fetch(`/api/quizzes/${quizId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (response.status === 204) {
      console.log('delete successful');
      setQuizzes(quizzes.filter(quiz => quiz.quizId !== quizId));
    } else {
      alert('Error deleting quiz.');
    }
  }

  return (
    <div className="main-dashboard container-fluid">
      <div className="players">
        Welcome <span id="userId" className="player-name">{user.userId.charAt(0).toUpperCase() + user.userId.slice(1)}</span>
        {/* <span id="userId" class="player-name"></span> */}
      </div>
      <br />
      <button className="btn btn-primary text-reset" onClick={() => window.location.href = `/create`}>Create Quiz</button>
      <br />
      <br />
      <br />

      <h2>{user && user.userId + '\'s Quizzes: '}</h2>
      {quizzes.filter(quiz => user.id === quiz.creatorId).map((quiz) => (
        <div key={quiz.quizId} className="quiz-item card mb-3">
          <h2 className="card-header">{quiz.title}</h2>
          <div className="card-body">
            {user.id === quiz.creatorId && <button className="btn btn-primary me-2 text-reset" onClick={() => window.location.href = `/edit?quizId=${quiz.quizId}`}>Edit</button>}
            <button className="btn btn-success me-4 text-reset" onClick={() => window.location.href = `/quiz?quizId=${quiz.quizId}`}>Take</button>
            {user.id === quiz.creatorId && <button className="btn btn-danger text-reset" onClick={() => deleteQuiz(quiz.quizId)}>Delete</button>}
          </div>
        </div>
      ))}


      <h2>{'Community\'s Quizzes: '}</h2>
      {quizzes.filter(quiz => user.id !== quiz.creatorId).map((quiz) => (
        <div key={quiz.quizId} className="quiz-item card mb-3">
          <h2 className="card-header">{quiz.title}</h2>
          <div className="card-body">
            {user.id === quiz.creatorId && <button className="btn btn-primary me-2 text-reset" onClick={() => window.location.href = `/edit?quizId=${quiz.quizId}`}>Edit</button>}
            <button className="btn btn-success me-4 text-reset" onClick={() => window.location.href = `/quiz?quizId=${quiz.quizId}`}>Take</button>
            {user.id === quiz.creatorId && <button className="btn btn-danger text-reset" onClick={() => deleteQuiz(quiz.quizId)}>Delete</button>}
          </div>
        </div>
      ))}
    </div>
  );
}
