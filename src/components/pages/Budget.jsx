import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import BudgetChart from '@/components/organisms/BudgetChart'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { getBudgetItems } from '@/services/api/budgetService'

const Budget = () => {
  const [budgetItems, setBudgetItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  const loadBudgetItems = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await getBudgetItems()
      setBudgetItems(data)
    } catch (err) {
      setError(err.message || 'Failed to load budget')
      toast.error('Failed to load budget')
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadBudgetItems()
  }, [])
  
  const handleAddBudgetItem = () => {
    toast.info('Add budget item form would open here')
  }
  
  if (loading) return <Loading type="dashboard" />
  if (error) return <Error message={error} onRetry={loadBudgetItems} />
  
  const totalBudget = budgetItems.reduce((sum, item) => sum + item.budgeted, 0)
  const totalSpent = budgetItems.reduce((sum, item) => sum + item.actual, 0)
  const remaining = totalBudget - totalSpent
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display text-gray-900">Budget Tracker</h1>
          <p className="text-gray-600 mt-2">Manage your wedding expenses</p>
        </div>
        <Button onClick={handleAddBudgetItem} className="mt-4 sm:mt-0">
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Budget Item
        </Button>
      </div>
      
      {budgetItems.length === 0 ? (
        <Empty
          title="No budget items yet"
          description="Start by adding your first budget category to track expenses."
          icon="DollarSign"
          actionText="Add Budget Item"
          onAction={handleAddBudgetItem}
        />
      ) : (
        <>
          {/* Budget Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Target" className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">${totalBudget.toLocaleString()}</h3>
              <p className="text-gray-600">Total Budget</p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-warning to-yellow-400 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="TrendingUp" className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">${totalSpent.toLocaleString()}</h3>
              <p className="text-gray-600">Total Spent</p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className={`w-12 h-12 bg-gradient-to-br ${
                remaining >= 0 ? 'from-success to-green-400' : 'from-error to-red-400'
              } rounded-lg flex items-center justify-center mx-auto mb-4`}>
                <ApperIcon name="Wallet" className="w-6 h-6 text-white" />
              </div>
              <h3 className={`text-2xl font-bold ${remaining >= 0 ? 'text-success' : 'text-error'}`}>
                ${Math.abs(remaining).toLocaleString()}
              </h3>
              <p className="text-gray-600">{remaining >= 0 ? 'Remaining' : 'Over Budget'}</p>
            </Card>
          </div>
          
          {/* Budget Chart */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Budget Breakdown</h2>
            <BudgetChart data={budgetItems} />
          </Card>
          
          {/* Budget Items Table */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Budget Items</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 text-sm font-medium text-gray-700">Category</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-700">Vendor</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-700">Budgeted</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-700">Actual</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-700">Difference</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {budgetItems.map((item, index) => {
                    const difference = item.actual - item.budgeted
                    return (
                      <motion.tr
                        key={item.Id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-secondary/30 transition-colors duration-200"
                      >
                        <td className="py-4 text-sm text-gray-900">{item.category}</td>
                        <td className="py-4 text-sm text-gray-600">{item.vendor}</td>
                        <td className="py-4 text-sm text-gray-900">${item.budgeted.toLocaleString()}</td>
                        <td className="py-4 text-sm text-gray-900">${item.actual.toLocaleString()}</td>
                        <td className={`py-4 text-sm ${
                          difference > 0 ? 'text-error' : difference < 0 ? 'text-success' : 'text-gray-600'
                        }`}>
                          {difference > 0 ? '+' : ''}${difference.toLocaleString()}
                        </td>
                        <td className="py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            item.paid 
                              ? 'bg-success/20 text-success' 
                              : 'bg-warning/20 text-warning'
                          }`}>
                            {item.paid ? 'Paid' : 'Pending'}
                          </span>
                        </td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </motion.div>
  )
}

export default Budget