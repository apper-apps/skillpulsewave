import lessonsData from '@/services/mockData/lessons.json'

export const LessonsService = {
  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...lessonsData]
  },

  async getById(id) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200))
    const lesson = lessonsData.find(lesson => lesson.Id === id)
    if (!lesson) {
      throw new Error('Lesson not found')
    }
    return { ...lesson }
  },

  async getByCourseId(courseId) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 250))
    const courseLessons = lessonsData
      .filter(lesson => lesson.courseId === courseId)
      .sort((a, b) => a.order - b.order)
    return courseLessons.map(lesson => ({ ...lesson }))
  },

  async create(lessonData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    const newId = Math.max(...lessonsData.map(l => l.Id)) + 1
    const newLesson = {
      Id: newId,
      ...lessonData
    }
    lessonsData.push(newLesson)
    return { ...newLesson }
  },

  async update(id, updateData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400))
    const index = lessonsData.findIndex(lesson => lesson.Id === id)
    if (index === -1) {
      throw new Error('Lesson not found')
    }
    lessonsData[index] = { ...lessonsData[index], ...updateData }
    return { ...lessonsData[index] }
  },

  async delete(id) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = lessonsData.findIndex(lesson => lesson.Id === id)
    if (index === -1) {
      throw new Error('Lesson not found')
    }
    const deletedLesson = lessonsData.splice(index, 1)[0]
    return { ...deletedLesson }
  }
}