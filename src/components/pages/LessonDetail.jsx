import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import VideoPlayer from '@/components/molecules/VideoPlayer'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { LessonsService } from '@/services/api/lessonsService'
import { CoursesService } from '@/services/api/coursesService'
import { ProgressService } from '@/services/api/progressService'

const LessonDetail = () => {
  const { courseId, lessonId } = useParams()
  const navigate = useNavigate()
  const [lesson, setLesson] = useState(null)
  const [course, setCourse] = useState(null)
  const [lessons, setLessons] = useState([])
  const [progress, setProgress] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showTranscript, setShowTranscript] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  
  useEffect(() => {
    loadData()
  }, [courseId, lessonId])
  
  const loadData = async () => {
    try {
      setError('')
      setLoading(true)
      
      const [lessonData, courseData, lessonsData, progressData] = await Promise.all([
        LessonsService.getById(parseInt(lessonId)),
        CoursesService.getById(parseInt(courseId)),
        LessonsService.getByCourseId(parseInt(courseId)),
        ProgressService.getByCourseId(parseInt(courseId))
      ])
      
      setLesson(lessonData)
      setCourse(courseData)
      setLessons(lessonsData)
      setProgress(progressData)
      
      // Check if lesson is completed
      const completed = progressData?.completedLessons?.includes(parseInt(lessonId)) || false
      setIsCompleted(completed)
      
    } catch (err) {
      setError('Failed to load lesson details')
      console.error('Error loading lesson:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const handleRetry = () => {
    loadData()
  }
  
  const handleVideoComplete = async () => {
    if (!isCompleted) {
      try {
        await ProgressService.markLessonComplete(parseInt(courseId), parseInt(lessonId))
        setIsCompleted(true)
        toast.success('Lesson completed! Great job!')
        
        // Reload progress to update state
        const updatedProgress = await ProgressService.getByCourseId(parseInt(courseId))
        setProgress(updatedProgress)
      } catch (err) {
        console.error('Error marking lesson complete:', err)
        toast.error('Failed to mark lesson as complete')
      }
    }
  }
  
  const handleTakeQuiz = () => {
    navigate(`/quiz/${courseId}/${lessonId}`)
  }
  
  const getNextLesson = () => {
    const currentIndex = lessons.findIndex(l => l.Id === parseInt(lessonId))
    if (currentIndex < lessons.length - 1) {
      return lessons[currentIndex + 1]
    }
    return null
  }
  
  const getPreviousLesson = () => {
    const currentIndex = lessons.findIndex(l => l.Id === parseInt(lessonId))
    if (currentIndex > 0) {
      return lessons[currentIndex - 1]
    }
    return null
  }
  
  const handleNextLesson = () => {
    const nextLesson = getNextLesson()
    if (nextLesson) {
      navigate(`/courses/${courseId}/lesson/${nextLesson.Id}`)
    } else {
      navigate(`/courses/${courseId}`)
    }
  }
  
  const handlePreviousLesson = () => {
    const previousLesson = getPreviousLesson()
    if (previousLesson) {
      navigate(`/courses/${courseId}/lesson/${previousLesson.Id}`)
    }
  }
  
  if (loading) {
    return (
      <div className="p-4">
        <div className="mb-6">
          <div className="h-6 bg-gray-200 rounded mb-4 shimmer w-32" />
          <div className="h-8 bg-gray-200 rounded mb-4 shimmer w-64" />
        </div>
        <Loading type="video" />
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
  
  if (!lesson || !course) {
    return (
      <div className="p-4">
        <Error message="Lesson not found" onRetry={() => navigate(`/courses/${courseId}`)} />
      </div>
    )
  }
  
  const nextLesson = getNextLesson()
  const previousLesson = getPreviousLesson()
  const currentIndex = lessons.findIndex(l => l.Id === parseInt(lessonId))
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="flex items-center mb-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/courses/${courseId}`)}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ApperIcon name="ChevronLeft" size={24} className="text-gray-600" />
          </motion.button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">{lesson.title}</h1>
            <p className="text-sm text-gray-600">{course.title}</p>
          </div>
        </div>
        
        {/* Progress indicator */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-600">
            Lesson {currentIndex + 1} of {lessons.length}
          </span>
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / lessons.length) * 100}%` }}
            />
          </div>
          {isCompleted && (
            <div className="bg-green-500 w-6 h-6 rounded-full flex items-center justify-center">
              <ApperIcon name="Check" size={14} className="text-white" />
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4">
        {/* Video Player */}
        <div className="mb-6">
          <VideoPlayer
            videoUrl={lesson.videoUrl}
            onComplete={handleVideoComplete}
          />
        </div>
        
        {/* Lesson Info */}
        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">{lesson.title}</h2>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-gray-600">
                <ApperIcon name="Clock" size={16} />
                <span className="text-sm">{lesson.duration} min</span>
              </div>
              {isCompleted && (
                <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                  Completed
                </div>
              )}
            </div>
          </div>
          
          {/* Transcript Toggle */}
          <div className="mb-4">
            <Button
              variant="outline"
              size="small"
              onClick={() => setShowTranscript(!showTranscript)}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="FileText" size={16} />
              <span>{showTranscript ? 'Hide' : 'Show'} Transcript</span>
            </Button>
          </div>
          
          {/* Transcript */}
          {showTranscript && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gray-50 p-4 rounded-lg"
            >
              <h3 className="font-semibold text-gray-800 mb-2">Transcript</h3>
              <p className="text-gray-700 leading-relaxed">{lesson.transcript}</p>
            </motion.div>
          )}
        </div>
        
        {/* Actions */}
        <div className="card p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">What's Next?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={handleTakeQuiz}
              className="flex items-center justify-center space-x-2"
            >
              <ApperIcon name="HelpCircle" size={20} />
              <span>Take Quiz</span>
            </Button>
            
            {nextLesson ? (
              <Button
                variant="outline"
                onClick={handleNextLesson}
                className="flex items-center justify-center space-x-2"
              >
                <span>Next Lesson</span>
                <ApperIcon name="ChevronRight" size={20} />
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => navigate(`/courses/${courseId}`)}
                className="flex items-center justify-center space-x-2"
              >
                <span>Back to Course</span>
                <ApperIcon name="BookOpen" size={20} />
              </Button>
            )}
          </div>
        </div>
        
        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="ghost"
            onClick={handlePreviousLesson}
            disabled={!previousLesson}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="ChevronLeft" size={20} />
            <span>Previous</span>
          </Button>
          
          <Button
            onClick={handleNextLesson}
            disabled={!nextLesson}
            className="flex items-center space-x-2"
          >
            <span>{nextLesson ? 'Next Lesson' : 'Complete Course'}</span>
            <ApperIcon name="ChevronRight" size={20} />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default LessonDetail