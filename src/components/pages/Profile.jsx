import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import ProgressRing from '@/components/atoms/ProgressRing'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { CoursesService } from '@/services/api/coursesService'
import { ProgressService } from '@/services/api/progressService'

const Profile = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [courses, setCourses] = useState([])
  const [progress, setProgress] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    userType: '',
    preferredDuration: ''
  })
  
  const userTypes = [
    { value: 'student', label: 'Student' },
    { value: 'professional', label: 'Professional' }
  ]
  
  const durations = [
    { value: '5', label: '5 minutes' },
    { value: '15', label: '15 minutes' },
    { value: '30', label: '30 minutes' }
  ]
  
  const achievements = [
    { id: 'first-lesson', title: 'First Steps', description: 'Complete your first lesson', icon: 'Play' },
    { id: 'course-complete', title: 'Course Master', description: 'Complete a full course', icon: 'BookOpen' },
    { id: 'quiz-ace', title: 'Quiz Ace', description: 'Score 100% on a quiz', icon: 'Trophy' },
    { id: 'streak-week', title: 'Consistent Learner', description: 'Learn for 7 days straight', icon: 'Calendar' },
    { id: 'community-helper', title: 'Community Helper', description: 'Help others in the community', icon: 'Users' }
  ]
  
  useEffect(() => {
    loadData()
  }, [])
  
  const loadData = async () => {
    try {
      setError('')
      setLoading(true)
      
      // Load user data
      const userData = localStorage.getItem('skillpulse_user')
      if (!userData) {
        navigate('/onboarding')
        return
      }
      
      const user = JSON.parse(userData)
      setUser(user)
      setEditForm({
        name: user.name || '',
        userType: user.userType || '',
        preferredDuration: user.preferredDuration || ''
      })
      
      // Load courses and progress
      const [coursesData, progressData] = await Promise.all([
        CoursesService.getAll(),
        ProgressService.getAll()
      ])
      
      setCourses(coursesData)
      setProgress(progressData)
      
    } catch (err) {
      setError('Failed to load profile data')
      console.error('Error loading profile:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const handleRetry = () => {
    loadData()
  }
  
  const handleSaveProfile = () => {
    if (!editForm.name.trim()) {
      toast.error('Please enter your name')
      return
    }
    
    const updatedUser = {
      ...user,
      name: editForm.name,
      userType: editForm.userType,
      preferredDuration: editForm.preferredDuration
    }
    
    localStorage.setItem('skillpulse_user', JSON.stringify(updatedUser))
    setUser(updatedUser)
    setIsEditing(false)
    toast.success('Profile updated successfully!')
  }
  
  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all your learning data? This action cannot be undone.')) {
      localStorage.removeItem('skillpulse_user')
      // Clear other data as needed
      toast.success('Data cleared successfully!')
      navigate('/onboarding')
    }
  }
  
  const calculateStats = () => {
    const totalCourses = courses.length
    const completedCourses = progress.filter(p => {
      const course = courses.find(c => c.Id === p.courseId)
      if (!course) return false
      const completedLessons = p.completedLessons ? p.completedLessons.length : 0
      return completedLessons === course.totalLessons
    }).length
    
    const totalLessons = courses.reduce((sum, course) => sum + course.totalLessons, 0)
    const completedLessons = progress.reduce((sum, p) => sum + (p.completedLessons ? p.completedLessons.length : 0), 0)
    
    const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
    
    return {
      totalCourses,
      completedCourses,
      totalLessons,
      completedLessons,
      overallProgress,
      joinDate: user?.joinDate || new Date().toISOString(),
      streak: user?.streak || 0
    }
  }
  
  const getUnlockedAchievements = () => {
    const stats = calculateStats()
    const unlocked = []
    
    if (stats.completedLessons > 0) {
      unlocked.push(achievements.find(a => a.id === 'first-lesson'))
    }
    if (stats.completedCourses > 0) {
      unlocked.push(achievements.find(a => a.id === 'course-complete'))
    }
    if (stats.streak >= 7) {
      unlocked.push(achievements.find(a => a.id === 'streak-week'))
    }
    
    return unlocked.filter(Boolean)
  }
  
  const getCourseProgress = (courseId) => {
    const courseProgress = progress.find(p => p.courseId === courseId)
    if (!courseProgress) return 0
    
    const course = courses.find(c => c.Id === courseId)
    if (!course) return 0
    
    const completedLessons = courseProgress.completedLessons ? courseProgress.completedLessons.length : 0
    return Math.round((completedLessons / course.totalLessons) * 100)
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
  
  const stats = calculateStats()
  const unlockedAchievements = getUnlockedAchievements()
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Profile</h1>
          <Button
            variant="outline"
            size="small"
            onClick={() => setIsEditing(!isEditing)}
            className="bg-white bg-opacity-20 border-white border-opacity-30 text-white hover:bg-white hover:bg-opacity-30"
          >
            <ApperIcon name={isEditing ? 'X' : 'Edit'} size={16} className="mr-2" />
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
        </div>
        
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <span className="text-3xl font-bold">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
          </div>
          <div>
            <h2 className="text-xl font-bold">{user?.name || 'User'}</h2>
            <p className="text-blue-100 capitalize">{user?.userType || 'Learner'}</p>
            <p className="text-blue-100 text-sm">
              Member since {format(new Date(stats.joinDate), 'MMMM yyyy')}
            </p>
          </div>
        </div>
        
        {/* Overall Progress */}
        <div className="flex items-center justify-center">
          <div className="bg-white bg-opacity-10 rounded-2xl p-6">
            <ProgressRing progress={stats.overallProgress} size={100} color="#FFFFFF" />
            <p className="text-center text-sm mt-2 text-blue-100">Overall Progress</p>
          </div>
        </div>
      </div>
      
      <div className="p-4 -mt-6">
        {/* Edit Profile Form */}
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card p-6 mb-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit Profile</h3>
            <div className="space-y-4">
              <Input
                label="Name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                placeholder="Enter your name"
              />
              
              <div>
                <label className="form-label">User Type</label>
                <select
                  value={editForm.userType}
                  onChange={(e) => setEditForm({ ...editForm, userType: e.target.value })}
                  className="form-input"
                >
                  {userTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="form-label">Preferred Duration</label>
                <select
                  value={editForm.preferredDuration}
                  onChange={(e) => setEditForm({ ...editForm, preferredDuration: e.target.value })}
                  className="form-input"
                >
                  {durations.map(duration => (
                    <option key={duration.value} value={duration.value}>
                      {duration.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveProfile}>
                Save Changes
              </Button>
            </div>
          </motion.div>
        )}
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Courses</p>
                <p className="text-2xl font-bold text-blue-800">{stats.completedCourses}/{stats.totalCourses}</p>
              </div>
              <div className="bg-blue-500 w-10 h-10 rounded-full flex items-center justify-center">
                <ApperIcon name="BookOpen" size={20} className="text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Lessons</p>
                <p className="text-2xl font-bold text-green-800">{stats.completedLessons}/{stats.totalLessons}</p>
              </div>
              <div className="bg-green-500 w-10 h-10 rounded-full flex items-center justify-center">
                <ApperIcon name="CheckCircle" size={20} className="text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Progress</p>
                <p className="text-2xl font-bold text-purple-800">{stats.overallProgress}%</p>
              </div>
              <div className="bg-purple-500 w-10 h-10 rounded-full flex items-center justify-center">
                <ApperIcon name="Target" size={20} className="text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-600 font-medium">Streak</p>
                <p className="text-2xl font-bold text-amber-800">{stats.streak} days</p>
              </div>
              <div className="bg-amber-500 w-10 h-10 rounded-full flex items-center justify-center">
                <ApperIcon name="Zap" size={20} className="text-white" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Achievements */}
        <div className="card p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map(achievement => {
              const isUnlocked = unlockedAchievements.some(a => a.id === achievement.id)
              return (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-lg border-2 ${
                    isUnlocked 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isUnlocked 
                        ? 'bg-green-500' 
                        : 'bg-gray-300'
                    }`}>
                      <ApperIcon 
                        name={achievement.icon} 
                        size={20} 
                        className={isUnlocked ? 'text-white' : 'text-gray-600'} 
                      />
                    </div>
                    <div>
                      <h4 className={`font-medium ${
                        isUnlocked ? 'text-green-800' : 'text-gray-600'
                      }`}>
                        {achievement.title}
                      </h4>
                      <p className={`text-sm ${
                        isUnlocked ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {achievement.description}
                      </p>
                    </div>
                    {isUnlocked && (
                      <div className="text-green-500">
                        <ApperIcon name="Check" size={16} />
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        
        {/* Course Progress */}
        <div className="card p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Course Progress</h3>
          <div className="space-y-4">
            {courses.map(course => {
              const progressPercent = getCourseProgress(course.Id)
              return (
                <div key={course.Id} className="flex items-center space-x-4">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ 
                      background: `linear-gradient(135deg, ${course.color} 0%, ${course.color}CC 100%)` 
                    }}
                  >
                    <ApperIcon name={course.icon} size={20} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-800">{course.title}</h4>
                      <span className="text-sm text-gray-600">{progressPercent}%</span>
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
                  </div>
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => navigate(`/courses/${course.Id}`)}
                  >
                    View
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
        
        {/* Settings */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-800">Preferred Duration</h4>
                <p className="text-sm text-gray-600">
                  {durations.find(d => d.value === user?.preferredDuration)?.label || 'Not set'}
                </p>
              </div>
              <Button
                variant="outline"
                size="small"
                onClick={() => setIsEditing(true)}
              >
                Change
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-800">Learning Data</h4>
                <p className="text-sm text-gray-600">Clear all progress and start over</p>
              </div>
              <Button
                variant="outline"
                size="small"
                onClick={handleClearData}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                Clear Data
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile