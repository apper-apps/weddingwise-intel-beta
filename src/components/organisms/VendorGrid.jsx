import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'

const VendorGrid = ({ vendors, onUpdateVendor, onDeleteVendor }) => {
  const getStatusBadge = (vendor) => {
    if (vendor.depositPaid && vendor.balanceDue === 0) {
      return { variant: 'success', text: 'Paid in Full' }
    } else if (vendor.depositPaid) {
      return { variant: 'warning', text: 'Deposit Paid' }
    } else {
      return { variant: 'error', text: 'Payment Due' }
    }
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {vendors.map((vendor, index) => {
        const status = getStatusBadge(vendor)
        return (
          <motion.div
            key={vendor.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 h-full flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{vendor.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{vendor.category}</p>
                  <Badge variant={status.variant} size="small">
                    {status.text}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onUpdateVendor(vendor.Id)}
                    className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors duration-200"
                  >
                    <ApperIcon name="Edit" className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteVendor(vendor.Id)}
                    className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors duration-200"
                  >
                    <ApperIcon name="Trash2" className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-3 flex-1">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Phone" className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{vendor.contact}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Mail" className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{vendor.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="DollarSign" className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">
                    ${vendor.cost.toLocaleString()}
                  </span>
                </div>
                {vendor.balanceDue > 0 && (
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="AlertCircle" className="w-4 h-4 text-warning" />
                    <span className="text-sm text-warning">
                      Balance Due: ${vendor.balanceDue.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )
      })}
    </motion.div>
  )
}

export default VendorGrid