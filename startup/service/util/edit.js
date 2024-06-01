// Using "find()" returns the first element in the provided array that satisfies the provided testing function. If no values satisfy the testing function, undefined is returned.
const DB = require('./database.js');

exports.editQuestion = async function(data, quizId) {
    let quizzes = await DB.editQuestion(data, quizId)
    return true
}
