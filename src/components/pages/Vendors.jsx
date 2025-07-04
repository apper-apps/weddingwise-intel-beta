import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import VendorGrid from '@/components/organisms/VendorGrid'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { getVendors, updateVendor, deleteVendor } from '@/services/api/vendorService'

const Vendors = () => {
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  const loadVendors = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await getVendors()
      setVendors(data)
    } catch (err) {
      setError(err.message || 'Failed to load vendors')
      toast.error('Failed to load vendors')
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadVendors()
  }, [])
  
  const handleUpdateVendor = async (id) => {
    try {
      toast.info('Vendor editing would open here')
    } catch (err) {
      toast.error('Failed to update vendor')
    }
  }
  
  const handleDeleteVendor = async (id) => {
    try {
      await deleteVendor(id)
      setVendors(vendors.filter(vendor => vendor.Id !== id))
      toast.success('Vendor removed successfully')
    } catch (err) {
      toast.error('Failed to remove vendor')
    }
  }
  
  const handleAddVendor = () => {
    toast.info('Add vendor form would open here')
  }
  
  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadVendors} />
  
  const totalCost = vendors.reduce((sum, vendor) => sum + vendor.cost, 0)
  const totalPaid = vendors.reduce((sum, vendor) => sum + (vendor.cost - vendor.balanceDue), 0)
  const fullyPaidVendors = vendors.filter(vendor => vendor.depositPaid && vendor.balanceDue === 0).length
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display text-gray-900">Vendors</h1>
          <p className="text-gray-600 mt-2">Manage your wedding vendors and payments</p>
        </div>
        <Button onClick={handleAddVendor} className="mt-4 sm:mt-0">
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Vendor
        </Button>
      </div>
      
      {vendors.length === 0 ? (
        <Empty
          title="No vendors yet"
          description="Start by adding your first vendor to track contacts and payments."
          icon="Store"
          actionText="Add Vendor"
          onAction={handleAddVendor}
        />
      ) : (
        <>
          {/* Vendor Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Store" className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{vendors.length}</h3>
              <p className="text-gray-600">Total Vendors</p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-success to-green-400 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="CheckCircle" className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-success">{fullyPaidVendors}</h3>
              <p className="text-gray-600">Fully Paid</p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-warning to-yellow-400 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="DollarSign" className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">${totalCost.toLocaleString()}</h3>
              <p className="text-gray-600">Total Cost</p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-info to-blue-400 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="CreditCard" className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">${totalPaid.toLocaleString()}</h3>
              <p className="text-gray-600">Total Paid</p>
            </Card>
          </div>
          
          {/* Vendor Grid */}
          <VendorGrid
            vendors={vendors}
            onUpdateVendor={handleUpdateVendor}
            onDeleteVendor={handleDeleteVendor}
          />
        </>
      )}
    </motion.div>
  )
}

export default Vendors