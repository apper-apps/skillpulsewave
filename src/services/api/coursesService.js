import coursesData from '@/services/mockData/courses.json'

export const CoursesService = {
  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...coursesData]
  },

  async getById(id) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200))
    const course = coursesData.find(course => course.Id === id)
    if (!course) {
      throw new Error('Course not found')
    }
    return { ...course }
  },

  async create(courseData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    const newId = Math.max(...coursesData.map(c => c.Id)) + 1
    const newCourse = {
      Id: newId,
      ...courseData
    }
    coursesData.push(newCourse)
    return { ...newCourse }
  },

  async update(id, updateData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400))
    const index = coursesData.findIndex(course => course.Id === id)
    if (index === -1) {
      throw new Error('Course not found')
    }
    coursesData[index] = { ...coursesData[index], ...updateData }
    return { ...coursesData[index] }
  },

  async delete(id) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = coursesData.findIndex(course => course.Id === id)
    if (index === -1) {
      throw new Error('Course not found')
    }
    const deletedCourse = coursesData.splice(index, 1)[0]
    return { ...deletedCourse }
  }
}