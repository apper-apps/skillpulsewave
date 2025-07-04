import progressData from '@/services/mockData/progress.json'

export const ProgressService = {
  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200))
    return [...progressData]
  },

  async getByCourseId(courseId) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 150))
    const courseProgress = progressData.find(progress => progress.courseId === courseId)
    return courseProgress ? { ...courseProgress } : null
  },

  async markLessonComplete(courseId, lessonId) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    let courseProgress = progressData.find(progress => progress.courseId === courseId)
    
    if (!courseProgress) {
      // Create new progress record
      courseProgress = {
        userId: 'user_1',
        courseId: courseId,
        completedLessons: [lessonId],
        quizScores: {},
        lastAccessed: new Date().toISOString()
      }
      progressData.push(courseProgress)
    } else {
      // Update existing progress
      if (!courseProgress.completedLessons.includes(lessonId)) {
        courseProgress.completedLessons.push(lessonId)
      }
      courseProgress.lastAccessed = new Date().toISOString()
    }
    
    return { ...courseProgress }
  },

  async updateQuizScore(courseId, lessonId, score) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 250))
    
    let courseProgress = progressData.find(progress => progress.courseId === courseId)
    
    if (!courseProgress) {
      courseProgress = {
        userId: 'user_1',
        courseId: courseId,
        completedLessons: [],
        quizScores: { [lessonId]: score },
        lastAccessed: new Date().toISOString()
      }
      progressData.push(courseProgress)
    } else {
      courseProgress.quizScores[lessonId] = score
      courseProgress.lastAccessed = new Date().toISOString()
    }
    
    return { ...courseProgress }
  }
}