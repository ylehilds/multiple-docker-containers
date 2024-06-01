import React from 'react';
import './scores.css';

export function Scores() {
  const [scores, setScores] = React.useState([]);

  function addScores(scores) {
    let totalScore = 0;
    scores.forEach(score => {
      totalScore += score.score;
    })
    return totalScore;
  }

  // Demonstrates calling a service asynchronously so that
  // React can properly update state objects with the results.
  React.useEffect(() => {
    fetch('/api/scores')
      .then((response) => response.json())
      .then((scores) => {

        const data = []
        for (const [key, value] of Object.entries(scores)) {
          console.log(`${key}: ${value}`);
          data.push({
            username: value.username,
            scores: addScores(value.scores),
            date: value.lastUpdated ?? ''
          })
        }

        setScores(data);
        localStorage.setItem('scores', JSON.stringify(data));
      })
      .catch(() => {
        const scoresText = localStorage.getItem('scores');
        if (scoresText) {
          setScores(JSON.parse(scoresText));
        }
      });
  }, []);

  // sort scores
  scores.sort((a, b) => b.scores - a.scores);

  // Demonstrates rendering an array with React
  const scoreRows = [];
  if (scores.length) {
    for (const [i, score] of scores.entries()) {
      scoreRows.push(
        <tr key={i}>
          <td>{i + 1}</td>
          <td>{score.username}</td>
          <td>{score.scores}</td>
          <td>{score.date}</td>
        </tr>
      );
    }
  } else {
    scoreRows.push(
      <tr key='0'>
        <td colSpan='4'>Be the first to score</td>
      </tr>
    );
  }

  return (
    <main className="container-fluid text-center">
      <table className="table table-striped table-bordered table-hover">
        <caption>List of scores</caption>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Score</th>
            <th scope="col">Date</th>
          </tr>
        </thead>
        {/* <tbody id="tableBody"></tbody> */}
        <tbody id='scores'>{scoreRows}</tbody>
      </table>
    </main>
  );
}
