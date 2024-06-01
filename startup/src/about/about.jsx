import React from 'react';
import './about.css';
let socket

export function About(props) {
  const [imageUrl, setImageUrl] = React.useState('');
  const [quote, setQuote] = React.useState('Loading...');
  const [quoteAuthor, setQuoteAuthor] = React.useState('unknown');

// Functionality for peer communication using WebSocket

async function fetchQuote() {
  const httpResponse = await fetch('https://api.quotable.io/random');
  const jsonResponse = await httpResponse.json();
  console.log(jsonResponse);
  return jsonResponse
}

function configureWebSocket() {
  const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
  socket = new WebSocket(`${protocol}://${window.location.host}/ws`);
  socket.onmessage = async (event) => {
    const data = JSON.parse(await event.data.text());
    if (data.type !== 'quote') return
    displayMsg(data);
  };
}

async function fetchBroadcastQuote() {
  const data = await fetchQuote()
  displayMsg(data)
  broadcastEvent(data)
}

function displayMsg(data) {
  const chatText = document.querySelector('p.quote');
  chatText.textContent = data.content
  const author = document.querySelector('p.author');
  author.textContent = data.author
}

function broadcastEvent(data) {
  // add metadata to the data object
  data.type = 'quote';
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(data));
  } else {
    socket.addEventListener('open', () => {
      socket.send(JSON.stringify(data));
    });
  }
}

  // We only want this to render the first time the component is created and so we provide an empty dependency list.
  React.useEffect(() => {
    function displayPicture() {
      const random = Math.floor(Math.random() * 1000);
      fetch(`https://picsum.photos/v2/list?page=${random}&limit=1`)
        .then((response) => response.json())
        .then((data) => {
          const containerEl = document.querySelector('#picture');
  
          const width = containerEl.offsetWidth;
          const height = containerEl.offsetHeight;
          const apiUrl = `https://picsum.photos/id/${data[0].id}/${width}/${height}?grayscale`;
          setImageUrl(apiUrl);
        })
        .catch();
      }
  
      function displayQuote() {
      fetch('https://api.quotable.io/random')
        .then((response) => response.json())
        .then((data) => {
          setQuote(data.content);
          setQuoteAuthor(data.author);
        })
        .catch();
      }
  
      displayPicture();
      displayQuote();
      configureWebSocket()

  }, []);

  let imgEl = '';

  if (imageUrl) {
    imgEl = <img src={imageUrl} alt='stock background' />;
  }

  return (
    <div className="main-about container-fluid">
      <div id="picture2" className="picture-box"><img src="./images/quizMakerLogo.png" alt="pic2" /></div>
      {/* <div id="picture" class="picture-box"></div> */}
      <br /><br /><br />
      <div id='picture' className='picture-box'>
          {imgEl}
        </div>

      <p className="float-left">
        Have you ever been stressed out for a test and there is too much to learn for the test? Start small quizzing yourself on the subject matter one question at a time, once you create a quiz deck and get all the questions right, you will feel relieved that you got the correct knowledge to ace that test.
      </p>

      <p className="float-left">
        Quiz Maker is a fun application that lets you build an online quiz platform where users can create quizzes, take quizzes, and view their scores. Each user will have their own account behind authentication. All the quizzes and answers will be stored in a database, so go ahead and start today creating and taking quizzes, the result of each quiz will update your scores real-time.
      </p>

      {/* <div id="quote" class="quote-box text-reset float-left bg-body">
      </div> */}

      <div className='quote-box text-reset float-left bg-body'>
          <p className='quote'>{quote}</p>
          <p className='author'>{quoteAuthor}</p>
        </div>

      <br />
      <button className="btn btn-primary text-reset" onClick={fetchBroadcastQuote}>Get new quote</button>
    </div>
  )
}
