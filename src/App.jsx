import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from '@/components/organisms/Layout'
import Dashboard from '@/components/pages/Dashboard'
import Timeline from '@/components/pages/Timeline'
import Budget from '@/components/pages/Budget'
import Guests from '@/components/pages/Guests'
import Vendors from '@/components/pages/Vendors'
import Tasks from '@/components/pages/Tasks'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="timeline" element={<Timeline />} />
          <Route path="budget" element={<Budget />} />
          <Route path="guests" element={<Guests />} />
          <Route path="vendors" element={<Vendors />} />
          <Route path="tasks" element={<Tasks />} />
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
      />
    </div>
  )
}

export default App