const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const express = require('express');
const app = express();
const create = require('./util/create.js');
const dashboard = require('./util/dashboard.js');
const edit = require('./util/edit.js');
const DB = require('./util/database.js');
const { peerProxy } = require('./peerProxy.js');

const authCookieName = 'token';

// The service port. In production the front-end code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 3000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Use the cookie parser middleware for tracking authentication tokens
app.use(cookieParser());

// Serve up the front-end static content hosting
app.use(express.static('public'));

// Trust headers that are forwarded from the proxy so we can determine IP addresses
app.set('trust proxy', true);

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);


// CreateAuth token for a new user
apiRouter.post('/auth/create', async (req, res) => {
  if (await DB.getUser(req.body.userId)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await DB.createUser(req.body.userId, req.body.password);

    // Set the cookie
    setAuthCookie(res, user.token);

    delete user.password // Don't send the password hash to the client
    res.send(user)
  }
});

// GetAuth token for the provided credentials
apiRouter.post('/auth/login', async (req, res) => {
  const user = await DB.getUser(req.body.userId);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      setAuthCookie(res, user.token);
      delete user.password // Don't send the password hash to the client
      res.send(user);
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

// getMe for the currently authenticated user
app.get('/user/me', async (req, res) => {
  authToken = req.cookies['token'];
  const user = await DB.getUserByToken(authToken)
  if (user) {
    res.send({ userId: user.userId });
    return;
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

// DeleteAuth token if stored in cookie
apiRouter.delete('/auth/logout', (_req, res) => {
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// GetUser returns information about a user
apiRouter.get('/user/:userId', async (req, res) => {
  const user = await DB.getUser(req.params.userId);
  if (user) {
    const token = req?.cookies.token;
    res.send({ userId: user.userId, authenticated: token === user.token });
    return;
  }
  res.status(404).send({ msg: 'Unknown' });
});

// TODO: the following middleware is not working at the moment, need to investigate how to make it work, but for the time being I will comment it out
// secureApiRouter verifies credentials for endpoints
// var secureApiRouter = express.Router();
// apiRouter.use(secureApiRouter);

// secureApiRouter.use(async (req, res, next) => {
//   authToken = req.cookies[authCookieName];
//   const user = await DB.getUserByToken(authToken);
//   if (user) {
//     next();
//   } else {
//     res.status(401).send({ msg: 'Unauthorized' });
//   }
// });

// getQuizzes
apiRouter.get('/quizzes', async (req, res) => {
  const dashboardQuizzes = await dashboard.getQuizzes()
  res.send(dashboardQuizzes);
});

// getQuizzesQuizId
apiRouter.get('/quizzes/:quizId', async (req, res) => {
  const quizId = req.params.quizId
  const quiz = await DB.getQuizzes(quizId);
  await res.status(200).send(quiz);
});

// createQuiz
apiRouter.post('/quizzes', async (req, res) => {
  const body = req.body
  const quiz = await create.createQuiz(body)
  res.status(201).send(quiz);
});

// deleteQuestionQuizId
apiRouter.delete('/quizzes/', async (req, res) => {
  const body = req.body
  const quiz = await create.deleteQuestion(body)
  res.status(204).send();
});

// editQuestionQuizId
apiRouter.put('/quizzes/:quizId', async (req, res) => {
  const body = req.body
  const quizId = req.params.quizId
  const quiz = await edit.editQuestion(body, quizId)
  res.status(200).send(quiz);
});

// deleteQuizId
apiRouter.delete('/quizzes/:quizId', async (req, res) => {
  const quizId = req.params.quizId
  const quizzesStorage = await dashboard.deleteQuiz(quizId)
  res.status(204).send();
});

// GetScores
apiRouter.get('/user', async (req, res) => {
  const user = await dashboard.getUser()
  res.send(user);
});

// GetScores
apiRouter.get('/scores', async (req, res) => {
  const scoresArray = await DB.getHighScores();
  res.status(200).send(scoresArray);
});

// scores are saved in memory and disappear whenever the service is restarted.
// SubmitScore
apiRouter.post('/:userId/score', async (req, res) => {
  const body = req.body
  const userId = req.params.userId
  let result

  const userScores = await DB.getUserScores(userId);
  if (userScores.length > 0) {
    const userScoreIndex = userScores[0].scores.findIndex(score => score.quizId == body.quizId);
    if (userScoreIndex == -1) {
      result = await DB.addQuizScores({ userId, scores: body });
    } else {
      result = await DB.updateQuizScore(userId, body.quizId, body );
    }
  } else {
    const newScore = { userId: userId, scores: [ body ], lastUpdated: new Date().toLocaleString(), username: body.username};
    result = await DB.addScore(newScore);
  }
  console.log(result)
  res.status(200).send(result);
})

// Default error handler
app.use(function (err, req, res, next) {
  res.status(500).send({ type: err.name, message: err.message });
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' })
})

// setAuthCookie in the HTTP response
function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

const httpService = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

peerProxy(httpService);
