// Using "find()" returns the first element in the provided array that satisfies the provided testing function. If no values satisfy the testing function, undefined is returned.
const DB = require('./database.js');

exports.createQuiz = async function(data) {
    const { question, quizTitle, quizId, user } = data
    let quizzes = await DB.getQuizzes(quizId)
    if (quizzes.length > 0) {
        return await DB.addQuestion(data)
    } else {
        await DB.setQuizzes({ quizId: quizId, title: quizTitle, questions: [data.question] , creatorId: user.id})
        return await quizzes[quizId]
    }
}

exports.deleteQuestion = async function(data) {
    const { question, quizTitle, quizId, user , questionText} = data
    await DB.deleteQuestion(data)
    return true
}
