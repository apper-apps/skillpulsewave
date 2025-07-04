import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const Tools = () => {
  const navigate = useNavigate()
  
  const tools = [
    {
      id: 'time-planner',
      title: 'Time Planner',
      description: 'Plan your day with drag-and-drop scheduling',
      icon: 'Clock',
      color: '#3B82F6',
      gradient: 'from-blue-500 to-blue-600',
      path: '/tools/time-planner'
    },
    {
      id: 'communication-lab',
      title: 'Communication Lab',
      description: 'Practice and improve your communication skills',
      icon: 'MessageSquare',
      color: '#8B5CF6',
      gradient: 'from-purple-500 to-purple-600',
      path: '/tools/communication-lab'
    },
    {
      id: 'body-language-mirror',
      title: 'Body Language Mirror',
      description: 'Analyze and improve your body language',
      icon: 'Eye',
      color: '#10B981',
      gradient: 'from-green-500 to-green-600',
      path: '/tools/body-language-mirror'
    },
    {
      id: 'budget-buddy',
      title: 'Budget Buddy',
      description: 'Track expenses and manage your personal finances',
      icon: 'DollarSign',
      color: '#F59E0B',
      gradient: 'from-amber-500 to-amber-600',
      path: '/tools/budget-buddy'
    }
  ]
  
  const handleToolClick = (tool) => {
    if (tool.id === 'time-planner') {
      navigate(tool.path)
    } else {
      // Show coming soon message for other tools
      alert(`${tool.title} is coming soon! Stay tuned for updates.`)
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Tools</h1>
        <p className="text-gray-600">Interactive tools to practice and improve your skills</p>
      </div>
      
      <div className="p-4">
        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleToolClick(tool)}
              className="card p-6 cursor-pointer relative overflow-hidden"
            >
              {/* Background gradient */}
              <div 
                className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-5`}
              />
              
              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div 
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br ${tool.gradient} shadow-lg`}
                  >
                    <ApperIcon name={tool.icon} size={32} className="text-white" />
                  </div>
                  {tool.id !== 'time-planner' && (
                    <div className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">
                      Coming Soon
                    </div>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-2">{tool.title}</h3>
                <p className="text-gray-600 mb-4">{tool.description}</p>
                
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="small"
                    className="flex items-center space-x-2"
                  >
                    <span>{tool.id === 'time-planner' ? 'Open Tool' : 'Coming Soon'}</span>
                    <ApperIcon name="ChevronRight" size={16} />
                  </Button>
                  
                  <div className="flex items-center space-x-2 text-gray-500">
                    <ApperIcon name="Users" size={16} />
                    <span className="text-sm">Free</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Tips Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-6">
          <div className="flex items-center mb-4">
            <div className="bg-gradient-primary w-12 h-12 rounded-full flex items-center justify-center mr-4">
              <ApperIcon name="Lightbulb" size={24} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Pro Tips</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white bg-opacity-70 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Daily Practice</h3>
              <p className="text-sm text-gray-600">
                Use these tools for 10-15 minutes daily to see significant improvement in your skills.
              </p>
            </div>
            <div className="bg-white bg-opacity-70 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Track Progress</h3>
              <p className="text-sm text-gray-600">
                Keep notes of your practice sessions to monitor your growth over time.
              </p>
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">How often should I use these tools?</h3>
              <p className="text-gray-600">
                We recommend using each tool at least 2-3 times per week for optimal results. 
                Consistency is key to developing lasting skills.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Are these tools free to use?</h3>
              <p className="text-gray-600">
                Yes! All tools are completely free and available to all SkillPulse users. 
                No additional subscriptions or payments required.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Can I use these tools offline?</h3>
              <p className="text-gray-600">
                Some tools like the Time Planner work offline, while others require an internet 
                connection for full functionality.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Tools