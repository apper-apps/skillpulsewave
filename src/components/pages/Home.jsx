import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import ProgressRing from '@/components/atoms/ProgressRing'
import Button from '@/components/atoms/Button'
import CourseCard from '@/components/molecules/CourseCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { CoursesService } from '@/services/api/coursesService'
import { ProgressService } from '@/services/api/progressService'

const Home = () => {
  const [courses, setCourses] = useState([])
  const [progress, setProgress] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [user, setUser] = useState(null)
  const [dailyTip, setDailyTip] = useState('')
  const navigate = useNavigate()
  
  const dailyTips = [
    "Start your day with a 5-minute reflection on your communication goals.",
    "Practice active listening in your next conversation.",
    "Set three priority tasks for today using the 80/20 rule.",
    "Take a moment to check your posture and body language.",
    "Review your weekly budget and track one expense category.",
    "Practice speaking clearly and confidently in front of a mirror.",
    "Use the Pomodoro technique for your most challenging task today.",
    "Ask yourself: 'What's the most important thing I can do right now?'"
  ]
  
  useEffect(() => {
    const checkUser = () => {
      const userData = localStorage.getItem('skillpulse_user')
      if (!userData) {
        navigate('/onboarding')
        return
      }
      setUser(JSON.parse(userData))
    }
    
    const loadData = async () => {
      try {
        setError('')
        setLoading(true)
        
        const [coursesData, progressData] = await Promise.all([
          CoursesService.getAll(),
          ProgressService.getAll()
        ])
        
        setCourses(coursesData)
        setProgress(progressData)
        
        // Set daily tip based on current date
        const today = new Date()
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24))
        setDailyTip(dailyTips[dayOfYear % dailyTips.length])
        
      } catch (err) {
        setError('Failed to load dashboard data')
        console.error('Error loading dashboard:', err)
      } finally {
        setLoading(false)
      }
    }
    
    checkUser()
    loadData()
  }, [navigate])
  
  const handleRetry = () => {
    window.location.reload()
  }
  
  const calculateOverallProgress = () => {
    if (courses.length === 0) return 0
    
    const totalProgress = progress.reduce((sum, p) => {
      const course = courses.find(c => c.Id === p.courseId)
      if (!course) return sum
      const completedLessons = p.completedLessons ? p.completedLessons.length : 0
      const progressPercent = (completedLessons / course.totalLessons) * 100
      return sum + progressPercent
    }, 0)
    
    return Math.round(totalProgress / courses.length)
  }
  
  const getCourseProgress = (courseId) => {
    const courseProgress = progress.find(p => p.courseId === courseId)
    if (!courseProgress) return 0
    
    const course = courses.find(c => c.Id === courseId)
    if (!course) return 0
    
    const completedLessons = courseProgress.completedLessons ? courseProgress.completedLessons.length : 0
    return Math.round((completedLessons / course.totalLessons) * 100)
  }
  
  const getInProgressCourses = () => {
    return courses.filter(course => {
      const progressPercent = getCourseProgress(course.Id)
      return progressPercent > 0 && progressPercent < 100
    }).slice(0, 3)
  }
  
  const getRecommendedCourses = () => {
    return courses.filter(course => {
      const progressPercent = getCourseProgress(course.Id)
      return progressPercent === 0
    }).slice(0, 3)
  }
  
  if (loading) {
    return (
      <div className="p-4">
        <Loading />
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
  
  const overallProgress = calculateOverallProgress()
  const inProgressCourses = getInProgressCourses()
  const recommendedCourses = getRecommendedCourses()
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user?.name || 'Learner'}!</h1>
            <p className="text-blue-100">{format(new Date(), 'EEEE, MMMM d')}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/profile')}
            className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center"
          >
            <ApperIcon name="User" size={24} />
          </motion.button>
        </div>
        
        {/* Progress Ring */}
        <div className="flex items-center justify-center mb-6">
          <div className="bg-white bg-opacity-10 rounded-2xl p-6">
            <ProgressRing progress={overallProgress} size={120} color="#FFFFFF" />
            <p className="text-center text-sm mt-2 text-blue-100">Overall Progress</p>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold">{courses.length}</p>
            <p className="text-sm text-blue-100">Courses</p>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold">{inProgressCourses.length}</p>
            <p className="text-sm text-blue-100">In Progress</p>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold">
              {progress.reduce((sum, p) => sum + (p.completedLessons ? p.completedLessons.length : 0), 0)}
            </p>
            <p className="text-sm text-blue-100">Completed</p>
          </div>
        </div>
      </div>
      
      <div className="p-4 -mt-6">
        {/* Daily Tip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 mb-6"
        >
          <div className="flex items-center mb-3">
            <div className="bg-gradient-accent w-10 h-10 rounded-full flex items-center justify-center mr-3">
              <ApperIcon name="Lightbulb" size={20} className="text-white" />
            </div>
            <h3 className="font-semibold text-gray-800">Today's Tip</h3>
          </div>
          <p className="text-gray-700">{dailyTip}</p>
        </motion.div>
        
        {/* Continue Learning */}
        {inProgressCourses.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Continue Learning</h2>
              <Button
                variant="ghost"
                size="small"
                onClick={() => navigate('/courses')}
              >
                View All
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {inProgressCourses.map(course => (
                <CourseCard
                  key={course.Id}
                  course={course}
                  progress={getCourseProgress(course.Id)}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Recommended Courses */}
        {recommendedCourses.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Recommended for You</h2>
              <Button
                variant="ghost"
                size="small"
                onClick={() => navigate('/courses')}
              >
                View All
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendedCourses.map(course => (
                <CourseCard
                  key={course.Id}
                  course={course}
                  progress={getCourseProgress(course.Id)}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Quick Actions */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/tools/time-planner')}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg"
            >
              <ApperIcon name="Clock" size={32} className="mb-3" />
              <h3 className="font-semibold text-lg">Time Planner</h3>
              <p className="text-sm opacity-90">Plan your day</p>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/community')}
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg"
            >
              <ApperIcon name="Users" size={32} className="mb-3" />
              <h3 className="font-semibold text-lg">Community</h3>
              <p className="text-sm opacity-90">Connect & share</p>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home