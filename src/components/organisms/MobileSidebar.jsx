import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const MobileSidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  
  const menuItems = [
    { path: '/', label: 'Dashboard', icon: 'Home' },
    { path: '/timeline', label: 'Timeline', icon: 'Calendar' },
    { path: '/budget', label: 'Budget', icon: 'DollarSign' },
    { path: '/guests', label: 'Guests', icon: 'Users' },
    { path: '/vendors', label: 'Vendors', icon: 'Store' },
    { path: '/tasks', label: 'Tasks', icon: 'CheckSquare' }
  ]
  
  const toggleSidebar = () => setIsOpen(!isOpen)
  
  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-surface shadow-lg px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <ApperIcon name="Heart" className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-bold font-display text-gray-800">WeddingWise</h1>
        </div>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-secondary transition-colors duration-200"
        >
          <ApperIcon name="Menu" className="w-6 h-6 text-gray-600" />
        </button>
      </div>
      
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>
      
      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed left-0 top-0 bottom-0 w-64 bg-surface shadow-xl z-50 lg:hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-secondary">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                    <ApperIcon name="Heart" className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold font-display text-gray-800">WeddingWise</h1>
                    <p className="text-xs text-gray-500">Plan your perfect day</p>
                  </div>
                </div>
                <button
                  onClick={toggleSidebar}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors duration-200"
                >
                  <ApperIcon name="X" className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="flex-1 p-6">
              <ul className="space-y-2">
                {menuItems.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      onClick={toggleSidebar}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                          isActive
                            ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg'
                            : 'text-gray-600 hover:bg-secondary hover:text-primary'
                        }`
                      }
                    >
                      <ApperIcon name={item.icon} className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
            
            {/* Footer */}
            <div className="p-6 border-t border-secondary">
              <div className="bg-gradient-to-r from-secondary to-accent/20 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <ApperIcon name="Sparkles" className="w-6 h-6 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">Your big day is coming!</p>
                    <p className="text-xs text-gray-600">Stay organized and enjoy the journey</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default MobileSidebar