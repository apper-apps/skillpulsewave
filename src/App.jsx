import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from '@/components/organisms/Layout'
import Home from '@/components/pages/Home'
import Courses from '@/components/pages/Courses'
import CourseDetail from '@/components/pages/CourseDetail'
import LessonDetail from '@/components/pages/LessonDetail'
import Tools from '@/components/pages/Tools'
import Community from '@/components/pages/Community'
import Profile from '@/components/pages/Profile'
import Onboarding from '@/components/pages/Onboarding'
import TimePlanner from '@/components/pages/TimePlanner'
import Quiz from '@/components/pages/Quiz'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="courses" element={<Courses />} />
          <Route path="courses/:courseId" element={<CourseDetail />} />
          <Route path="courses/:courseId/lesson/:lessonId" element={<LessonDetail />} />
          <Route path="quiz/:courseId/:lessonId" element={<Quiz />} />
          <Route path="tools" element={<Tools />} />
          <Route path="tools/time-planner" element={<TimePlanner />} />
          <Route path="community" element={<Community />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </div>
  )
}

export default App