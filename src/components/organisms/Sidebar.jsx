import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Sidebar = () => {
  const menuItems = [
    { path: '/', label: 'Dashboard', icon: 'Home' },
    { path: '/timeline', label: 'Timeline', icon: 'Calendar' },
    { path: '/budget', label: 'Budget', icon: 'DollarSign' },
    { path: '/guests', label: 'Guests', icon: 'Users' },
    { path: '/vendors', label: 'Vendors', icon: 'Store' },
    { path: '/tasks', label: 'Tasks', icon: 'CheckSquare' }
  ]
  
  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="w-64 bg-surface shadow-xl h-full flex flex-col"
    >
      {/* Logo */}
      <div className="p-6 border-b border-secondary">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <ApperIcon name="Heart" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display text-gray-800">WeddingWise</h1>
            <p className="text-xs text-gray-500">Plan your perfect day</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-6">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
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
  )
}

export default Sidebar