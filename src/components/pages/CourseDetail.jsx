import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import ProgressRing from '@/components/atoms/ProgressRing'
import LessonCard from '@/components/molecules/LessonCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { CoursesService } from '@/services/api/coursesService'
import { LessonsService } from '@/services/api/lessonsService'
import { ProgressService } from '@/services/api/progressService'

const CourseDetail = () => {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [lessons, setLessons] = useState([])
  const [progress, setProgress] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  useEffect(() => {
    loadData()
  }, [courseId])
  
  const loadData = async () => {
    try {
      setError('')
      setLoading(true)
      
      const [courseData, lessonsData, progressData] = await Promise.all([
        CoursesService.getById(parseInt(courseId)),
        LessonsService.getByCourseId(parseInt(courseId)),
        ProgressService.getByCourseId(parseInt(courseId))
      ])
      
      setCourse(courseData)
      setLessons(lessonsData)
      setProgress(progressData)
      
    } catch (err) {
      setError('Failed to load course details')
      console.error('Error loading course:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const handleRetry = () => {
    loadData()
  }
  
  const getProgressPercent = () => {
    if (!progress || !course) return 0
    const completedLessons = progress.completedLessons ? progress.completedLessons.length : 0
    return Math.round((completedLessons / course.totalLessons) * 100)
  }
  
  const isLessonCompleted = (lessonId) => {
    return progress?.completedLessons?.includes(lessonId) || false
  }
  
  const isLessonLocked = (lessonIndex) => {
    if (lessonIndex === 0) return false
    const previousLesson = lessons[lessonIndex - 1]
    return !isLessonCompleted(previousLesson?.Id)
  }
  
  const getNextLesson = () => {
    if (!progress?.completedLessons) return lessons[0]
    
    for (let i = 0; i < lessons.length; i++) {
      if (!isLessonCompleted(lessons[i].Id)) {
        return lessons[i]
      }
    }
    
    return null
  }
  
  const handleStartCourse = () => {
    const nextLesson = getNextLesson()
    if (nextLesson) {
      navigate(`/courses/${courseId}/lesson/${nextLesson.Id}`)
    }
  }
  
  if (loading) {
    return (
      <div className="p-4">
        <div className="mb-6">
          <div className="h-6 bg-gray-200 rounded mb-4 shimmer w-32" />
          <div className="h-8 bg-gray-200 rounded mb-4 shimmer w-64" />
          <div className="h-20 bg-gray-200 rounded mb-4 shimmer" />
        </div>
        <Loading type="lessons" />
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="p-4">
        <Error message={error} onRetry={handleRetry} />
      </div>
    )
  }
  
  if (!course) {
    return (
      <div className="p-4">
        <Error message="Course not found" onRetry={() => navigate('/courses')} />
      </div>
    )
  }
  
  const progressPercent = getProgressPercent()
  const nextLesson = getNextLesson()
  const completedLessons = progress?.completedLessons?.length || 0
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="flex items-center mb-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/courses')}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ApperIcon name="ChevronLeft" size={24} className="text-gray-600" />
          </motion.button>
          <h1 className="text-xl font-bold text-gray-800">Course Details</h1>
        </div>
      </div>
      
      {/* Course Info */}
      <div className="p-4">
        <div className="card p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Course Icon */}
            <div 
              className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg"
              style={{ 
                background: `linear-gradient(135deg, ${course.color} 0%, ${course.color}CC 100%)` 
              }}
            >
              <ApperIcon name={course.icon} size={40} className="text-white" />
            </div>
            
            {/* Course Details */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{course.title}</h2>
              <div className="flex items-center space-x-4 text-gray-600 mb-4">
                <div className="flex items-center space-x-1">
                  <ApperIcon name="Clock" size={16} />
                  <span className="text-sm">{course.duration} minutes</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ApperIcon name="BookOpen" size={16} />
                  <span className="text-sm">{course.totalLessons} lessons</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ApperIcon name="Award" size={16} />
                  <span className="text-sm">{course.category}</span>
                </div>
              </div>
              
              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Progress</span>
                  <span className="text-sm font-medium text-gray-800">{progressPercent}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${progressPercent}%`,
                      background: `linear-gradient(90deg, ${course.color} 0%, ${course.color}CC 100%)`
                    }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {completedLessons} of {course.totalLessons} lessons completed
                </p>
              </div>
              
              {/* Action Button */}
              <Button
                onClick={handleStartCourse}
                disabled={!nextLesson}
                className="w-full md:w-auto"
              >
                {progressPercent === 0 ? 'Start Course' : 
                 progressPercent === 100 ? 'Review Course' : 
                 'Continue Learning'}
              </Button>
            </div>
            
            {/* Progress Ring */}
            <div className="flex-shrink-0">
              <ProgressRing 
                progress={progressPercent} 
                size={100} 
                color={course.color}
                strokeWidth={6}
              />
            </div>
          </div>
        </div>
        
        {/* Lessons */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Lessons</h3>
          <div className="space-y-4">
            {lessons.map((lesson, index) => (
              <motion.div
                key={lesson.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <LessonCard
                  lesson={lesson}
                  courseId={courseId}
                  isCompleted={isLessonCompleted(lesson.Id)}
                  isLocked={isLessonLocked(index)}
                />
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Course Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Duration</p>
                <p className="text-2xl font-bold text-blue-800">{course.duration}m</p>
              </div>
              <div className="bg-blue-500 w-10 h-10 rounded-full flex items-center justify-center">
                <ApperIcon name="Clock" size={20} className="text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Completed</p>
                <p className="text-2xl font-bold text-green-800">{completedLessons}</p>
              </div>
              <div className="bg-green-500 w-10 h-10 rounded-full flex items-center justify-center">
                <ApperIcon name="CheckCircle" size={20} className="text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Remaining</p>
                <p className="text-2xl font-bold text-purple-800">{course.totalLessons - completedLessons}</p>
              </div>
              <div className="bg-purple-500 w-10 h-10 rounded-full flex items-center justify-center">
                <ApperIcon name="BookOpen" size={20} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetail