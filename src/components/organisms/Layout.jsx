import { Outlet } from 'react-router-dom'
import BottomNavigation from '@/components/organisms/BottomNavigation'

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main content area */}
      <main className="pb-20">
        <Outlet />
      </main>
      
      {/* Bottom navigation */}
      <BottomNavigation />
    </div>
  )
}

export default Layout