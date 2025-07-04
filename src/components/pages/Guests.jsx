import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import GuestTable from '@/components/organisms/GuestTable'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { getGuests, updateGuest, deleteGuest } from '@/services/api/guestService'

const Guests = () => {
  const [guests, setGuests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  const loadGuests = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await getGuests()
      setGuests(data)
    } catch (err) {
      setError(err.message || 'Failed to load guests')
      toast.error('Failed to load guests')
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadGuests()
  }, [])
  
  const handleUpdateGuest = async (id) => {
    try {
      toast.info('Guest editing would open here')
    } catch (err) {
      toast.error('Failed to update guest')
    }
  }
  
  const handleDeleteGuest = async (id) => {
    try {
      await deleteGuest(id)
      setGuests(guests.filter(guest => guest.Id !== id))
      toast.success('Guest removed successfully')
    } catch (err) {
      toast.error('Failed to remove guest')
    }
  }
  
  const handleAddGuest = () => {
    toast.info('Add guest form would open here')
  }
  
  if (loading) return <Loading type="table" />
  if (error) return <Error message={error} onRetry={loadGuests} />
  
  const confirmedGuests = guests.filter(guest => guest.rsvpStatus === 'Confirmed').length
  const pendingGuests = guests.filter(guest => guest.rsvpStatus === 'Pending').length
  const declinedGuests = guests.filter(guest => guest.rsvpStatus === 'Declined').length
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display text-gray-900">Guest List</h1>
          <p className="text-gray-600 mt-2">Manage your wedding guests and RSVPs</p>
        </div>
        <Button onClick={handleAddGuest} className="mt-4 sm:mt-0">
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Guest
        </Button>
      </div>
      
      {guests.length === 0 ? (
        <Empty
          title="No guests yet"
          description="Start building your guest list by adding your first guest."
          icon="Users"
          actionText="Add Guest"
          onAction={handleAddGuest}
        />
      ) : (
        <>
          {/* Guest Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Users" className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{guests.length}</h3>
              <p className="text-gray-600">Total Guests</p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-success to-green-400 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="CheckCircle" className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-success">{confirmedGuests}</h3>
              <p className="text-gray-600">Confirmed</p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-warning to-yellow-400 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Clock" className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-warning">{pendingGuests}</h3>
              <p className="text-gray-600">Pending</p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-error to-red-400 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="XCircle" className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-error">{declinedGuests}</h3>
              <p className="text-gray-600">Declined</p>
            </Card>
          </div>
          
          {/* Guest Table */}
          <Card className="p-6">
            <GuestTable
              guests={guests}
              onUpdateGuest={handleUpdateGuest}
              onDeleteGuest={handleDeleteGuest}
            />
          </Card>
        </>
      )}
    </motion.div>
  )
}

export default Guests