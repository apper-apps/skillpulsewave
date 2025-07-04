import { useNavigate } from 'react-router-dom'
import NavigationItem from '@/components/molecules/NavigationItem'

const BottomNavigation = () => {
  const navigate = useNavigate()
  
  const navigationItems = [
    { icon: 'Home', label: 'Home', path: '/' },
    { icon: 'BookOpen', label: 'Courses', path: '/courses' },
    { icon: 'Wrench', label: 'Tools', path: '/tools' },
    { icon: 'Users', label: 'Community', path: '/community' },
    { icon: 'User', label: 'Profile', path: '/profile' },
  ]
  
  const handleNavigation = (path) => {
    navigate(path)
  }
  
  return (
    <nav className="bottom-nav">
      <div className="flex items-center justify-around">
        {navigationItems.map((item) => (
          <NavigationItem
            key={item.path}
            icon={item.icon}
            label={item.label}
            path={item.path}
            onClick={handleNavigation}
          />
        ))}
      </div>
    </nav>
  )
}

export default BottomNavigation