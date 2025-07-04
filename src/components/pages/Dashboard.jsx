import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'
import ProgressRing from '@/components/molecules/ProgressRing'
import CountdownTimer from '@/components/molecules/CountdownTimer'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { getWeddingData, getTasks, getGuests, getVendors, getBudgetItems } from '@/services/api/dashboardService'

const Dashboard = () => {
  const [wedding, setWedding] = useState(null)
  const [tasks, setTasks] = useState([])
  const [guests, setGuests] = useState([])
  const [vendors, setVendors] = useState([])
  const [budgetItems, setBudgetItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [weddingData, tasksData, guestsData, vendorsData, budgetData] = await Promise.all([
        getWeddingData(),
        getTasks(),
        getGuests(),
        getVendors(),
        getBudgetItems()
      ])
      
      setWedding(weddingData)
      setTasks(tasksData)
      setGuests(guestsData)
      setVendors(vendorsData)
      setBudgetItems(budgetData)
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data')
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadDashboardData()
  }, [])
  
  if (loading) return <Loading type="dashboard" />
  if (error) return <Error message={error} onRetry={loadDashboardData} />
  if (!wedding) return <Error message="Wedding data not found" onRetry={loadDashboardData} />
  
  const completedTasks = tasks.filter(task => task.completed).length
  const taskProgress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0
  
  const confirmedGuests = guests.filter(guest => guest.rsvpStatus === 'Confirmed').length
  const guestProgress = guests.length > 0 ? (confirmedGuests / guests.length) * 100 : 0
  
  const totalBudget = budgetItems.reduce((sum, item) => sum + item.budgeted, 0)
  const totalSpent = budgetItems.reduce((sum, item) => sum + item.actual, 0)
  const budgetProgress = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0
  
  const paidVendors = vendors.filter(vendor => vendor.depositPaid && vendor.balanceDue === 0).length
  const vendorProgress = vendors.length > 0 ? (paidVendors / vendors.length) * 100 : 0
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold font-display bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
        >
          {wedding.coupleName}'s Wedding
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-gray-600"
        >
          {wedding.venue} • {new Date(wedding.date).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </motion.p>
      </div>
      
      {/* Countdown */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex justify-center"
      >
        <CountdownTimer targetDate={wedding.date} />
      </motion.div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <ProgressRing percentage={taskProgress} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">{completedTasks}/{tasks.length}</h3>
          <p className="text-gray-600">Tasks Completed</p>
        </Card>
        
        <Card className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <ProgressRing percentage={guestProgress} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">{confirmedGuests}/{guests.length}</h3>
          <p className="text-gray-600">Guests Confirmed</p>
        </Card>
        
        <Card className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <ProgressRing percentage={budgetProgress} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            ${totalSpent.toLocaleString()}/${totalBudget.toLocaleString()}
          </h3>
          <p className="text-gray-600">Budget Used</p>
        </Card>
        
        <Card className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <ProgressRing percentage={vendorProgress} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">{paidVendors}/{vendors.length}</h3>
          <p className="text-gray-600">Vendors Paid</p>
        </Card>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckSquare" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Upcoming Tasks</h3>
              <p className="text-gray-600">Next 7 days</p>
            </div>
          </div>
          <div className="space-y-2">
            {tasks
              .filter(task => !task.completed)
              .slice(0, 3)
              .map(task => (
                <div key={task.Id} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-sm text-gray-700">{task.title}</span>
                </div>
              ))}
            {tasks.filter(task => !task.completed).length === 0 && (
              <p className="text-sm text-gray-500">All tasks completed! 🎉</p>
            )}
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-success to-green-400 rounded-lg flex items-center justify-center">
              <ApperIcon name="Users" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">RSVP Status</h3>
              <p className="text-gray-600">Guest responses</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Confirmed</span>
              <span className="text-sm font-medium text-success">{confirmedGuests}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Pending</span>
              <span className="text-sm font-medium text-warning">
                {guests.filter(g => g.rsvpStatus === 'Pending').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Declined</span>
              <span className="text-sm font-medium text-error">
                {guests.filter(g => g.rsvpStatus === 'Declined').length}
              </span>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-warning to-yellow-400 rounded-lg flex items-center justify-center">
              <ApperIcon name="DollarSign" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Budget Summary</h3>
              <p className="text-gray-600">Financial overview</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Budget</span>
              <span className="text-sm font-medium text-gray-900">${totalBudget.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Spent</span>
              <span className="text-sm font-medium text-gray-900">${totalSpent.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Remaining</span>
              <span className={`text-sm font-medium ${
                totalBudget - totalSpent >= 0 ? 'text-success' : 'text-error'
              }`}>
                ${(totalBudget - totalSpent).toLocaleString()}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  )
}

export default Dashboard