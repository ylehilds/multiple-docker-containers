// Using "find()" returns the first element in the provided array that satisfies the provided testing function. If no values satisfy the testing function, undefined is returned.
const DB = require('./database.js');

// exports.deleteQuiz = async function(quizId, quizzes) {
//     delete quizzes[quizId]
//     return await quizzes
// }

exports.deleteQuiz = async function(quizId) {
    await DB.deleteQuiz(quizId)
    return true
}

exports.getQuizzes = async function() {
    const quizzes = await DB.getAllQuizzes()
    return quizzes
}

exports.getUser = async function() {
    const user = await DB.getUser()
    return user
}