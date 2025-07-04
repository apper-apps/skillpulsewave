import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'

const NavigationItem = ({ icon, label, path, onClick }) => {
  const location = useLocation()
  const isActive = location.pathname === path || 
                  (path !== '/' && location.pathname.startsWith(path))
  
  const handleClick = () => {
    onClick(path)
  }
  
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className={`bottom-nav-item ${isActive ? 'active' : ''}`}
    >
      <motion.div
        animate={{
          scale: isActive ? 1.1 : 1,
          y: isActive ? -2 : 0
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <ApperIcon 
          name={icon} 
          size={24} 
          className={`mb-1 ${isActive ? 'text-primary' : 'text-gray-500'}`} 
        />
      </motion.div>
      <span className={`text-xs font-medium ${isActive ? 'text-primary' : 'text-gray-500'}`}>
        {label}
      </span>
    </motion.button>
  )
}

export default NavigationItem