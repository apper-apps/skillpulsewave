import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [userData, setUserData] = useState({
    name: '',
    userType: '',
    preferredDuration: '',
    goals: []
  })
  const navigate = useNavigate()
  
  const steps = [
    {
      title: 'Welcome to SkillPulse',
      subtitle: 'Your journey to mastering essential skills starts here',
      icon: 'Zap'
    },
    {
      title: "What's your name?",
      subtitle: 'We want to personalize your learning experience',
      icon: 'User'
    },
    {
      title: 'Tell us about yourself',
      subtitle: 'This helps us customize your learning path',
      icon: 'Users'
    },
    {
      title: 'How much time can you dedicate?',
      subtitle: 'Choose your preferred lesson duration',
      icon: 'Clock'
    },
    {
      title: 'What do you want to focus on?',
      subtitle: 'Select your learning goals',
      icon: 'Target'
    }
  ]
  
  const userTypes = [
    { id: 'student', label: 'Student', icon: 'GraduationCap', description: 'College student preparing for career' },
    { id: 'professional', label: 'Professional', icon: 'Briefcase', description: 'Early-career professional' }
  ]
  
  const durations = [
    { id: '5', label: '5 minutes', icon: 'Zap', description: 'Quick daily lessons' },
    { id: '15', label: '15 minutes', icon: 'Clock', description: 'Focused learning sessions' },
    { id: '30', label: '30 minutes', icon: 'BookOpen', description: 'Deep dive sessions' }
  ]
  
  const goals = [
    { id: 'time', label: 'Time Management', icon: 'Clock' },
    { id: 'communication', label: 'Communication', icon: 'MessageSquare' },
    { id: 'body-language', label: 'Body Language', icon: 'Eye' },
    { id: 'finance', label: 'Personal Finance', icon: 'DollarSign' }
  ]
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Save user data and navigate to home
      localStorage.setItem('skillpulse_user', JSON.stringify(userData))
      toast.success('Welcome to SkillPulse! Your learning journey begins now.')
      navigate('/')
    }
  }
  
  const handleSkip = () => {
    navigate('/')
  }
  
  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return true
      case 1:
        return userData.name.trim() !== ''
      case 2:
        return userData.userType !== ''
      case 3:
        return userData.preferredDuration !== ''
      case 4:
        return userData.goals.length > 0
      default:
        return true
    }
  }
  
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center">
            <div className="bg-gradient-primary w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <ApperIcon name="Zap" size={48} className="text-white" />
            </div>
            <p className="text-lg text-gray-600 mb-8">
              Transform your potential with bite-sized lessons designed for busy people like you.
            </p>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <ApperIcon name="Clock" size={24} className="text-primary mb-2" />
                <p className="text-sm font-medium text-gray-800">5-30 min lessons</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <ApperIcon name="Target" size={24} className="text-primary mb-2" />
                <p className="text-sm font-medium text-gray-800">Practical skills</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <ApperIcon name="Users" size={24} className="text-primary mb-2" />
                <p className="text-sm font-medium text-gray-800">Community support</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <ApperIcon name="Award" size={24} className="text-primary mb-2" />
                <p className="text-sm font-medium text-gray-800">Track progress</p>
              </div>
            </div>
          </div>
        )
      
      case 1:
        return (
          <div className="max-w-sm mx-auto">
            <div className="bg-gradient-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <ApperIcon name="User" size={32} className="text-white" />
            </div>
            <input
              type="text"
              placeholder="Enter your name"
              value={userData.name}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-center text-lg"
            />
          </div>
        )
      
      case 2:
        return (
          <div className="max-w-md mx-auto">
            <div className="bg-gradient-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <ApperIcon name="Users" size={32} className="text-white" />
            </div>
            <div className="space-y-4">
              {userTypes.map((type) => (
                <motion.button
                  key={type.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setUserData({ ...userData, userType: type.id })}
                  className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
                    userData.userType === type.id
                      ? 'border-primary bg-primary bg-opacity-10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      userData.userType === type.id ? 'bg-primary' : 'bg-gray-100'
                    }`}>
                      <ApperIcon 
                        name={type.icon} 
                        size={24} 
                        className={userData.userType === type.id ? 'text-white' : 'text-gray-600'} 
                      />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-800">{type.label}</h3>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )
      
      case 3:
        return (
          <div className="max-w-md mx-auto">
            <div className="bg-gradient-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <ApperIcon name="Clock" size={32} className="text-white" />
            </div>
            <div className="space-y-4">
              {durations.map((duration) => (
                <motion.button
                  key={duration.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setUserData({ ...userData, preferredDuration: duration.id })}
                  className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
                    userData.preferredDuration === duration.id
                      ? 'border-primary bg-primary bg-opacity-10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      userData.preferredDuration === duration.id ? 'bg-primary' : 'bg-gray-100'
                    }`}>
                      <ApperIcon 
                        name={duration.icon} 
                        size={24} 
                        className={userData.preferredDuration === duration.id ? 'text-white' : 'text-gray-600'} 
                      />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-800">{duration.label}</h3>
                      <p className="text-sm text-gray-600">{duration.description}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )
      
      case 4:
        return (
          <div className="max-w-md mx-auto">
            <div className="bg-gradient-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <ApperIcon name="Target" size={32} className="text-white" />
            </div>
            <p className="text-center text-gray-600 mb-6">Select all that apply:</p>
            <div className="grid grid-cols-2 gap-4">
              {goals.map((goal) => (
                <motion.button
                  key={goal.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const newGoals = userData.goals.includes(goal.id)
                      ? userData.goals.filter(g => g !== goal.id)
                      : [...userData.goals, goal.id]
                    setUserData({ ...userData, goals: newGoals })
                  }}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    userData.goals.includes(goal.id)
                      ? 'border-primary bg-primary bg-opacity-10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                    userData.goals.includes(goal.id) ? 'bg-primary' : 'bg-gray-100'
                  }`}>
                    <ApperIcon 
                      name={goal.icon} 
                      size={24} 
                      className={userData.goals.includes(goal.id) ? 'text-white' : 'text-gray-600'} 
                    />
                  </div>
                  <h3 className="font-semibold text-gray-800 text-sm">{goal.label}</h3>
                </motion.button>
              ))}
            </div>
          </div>
        )
      
      default:
        return null
    }
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep + 1} of {steps.length}
            </span>
            <button
              onClick={handleSkip}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Skip
            </button>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
        
        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {steps[currentStep].title}
              </h1>
              <p className="text-gray-600 mb-8">
                {steps[currentStep].subtitle}
              </p>
              
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
          
          {/* Actions */}
          <div className="flex justify-between mt-8">
            <Button
              variant="ghost"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              <ApperIcon name="ChevronLeft" size={20} className="mr-2" />
              Back
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
            >
              {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
              <ApperIcon name="ChevronRight" size={20} className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Onboarding