import quizData from '@/services/mockData/quiz.json'

export const QuizService = {
  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...quizData]
  },

  async getById(id) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200))
    const quiz = quizData.find(quiz => quiz.Id === id)
    if (!quiz) {
      throw new Error('Quiz not found')
    }
    return { ...quiz }
  },

  async getByLessonId(lessonId) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 250))
    const quiz = quizData.find(quiz => quiz.lessonId === lessonId)
    if (!quiz) {
      throw new Error('Quiz not found for this lesson')
    }
    return { ...quiz }
  },

  async create(quizData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    const newId = Math.max(...quizData.map(q => q.Id)) + 1
    const newQuiz = {
      Id: newId,
      ...quizData
    }
    quizData.push(newQuiz)
    return { ...newQuiz }
  },

  async update(id, updateData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400))
    const index = quizData.findIndex(quiz => quiz.Id === id)
    if (index === -1) {
      throw new Error('Quiz not found')
    }
    quizData[index] = { ...quizData[index], ...updateData }
    return { ...quizData[index] }
  },

  async delete(id) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = quizData.findIndex(quiz => quiz.Id === id)
    if (index === -1) {
      throw new Error('Quiz not found')
    }
    const deletedQuiz = quizData.splice(index, 1)[0]
    return { ...deletedQuiz }
  }
}