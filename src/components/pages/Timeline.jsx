import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import TimelineView from '@/components/organisms/TimelineView'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { getMilestones, updateMilestone } from '@/services/api/timelineService'

const Timeline = () => {
  const [milestones, setMilestones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  const loadMilestones = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await getMilestones()
      setMilestones(data)
    } catch (err) {
      setError(err.message || 'Failed to load timeline')
      toast.error('Failed to load timeline')
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadMilestones()
  }, [])
  
  const handleUpdateMilestone = async (id) => {
    try {
      // For demo purposes, just show a toast
      toast.info('Milestone editing would open here')
    } catch (err) {
      toast.error('Failed to update milestone')
    }
  }
  
  const handleAddMilestone = () => {
    toast.info('Add milestone form would open here')
  }
  
  if (loading) return <Loading type="timeline" />
  if (error) return <Error message={error} onRetry={loadMilestones} />
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display text-gray-900">Wedding Timeline</h1>
          <p className="text-gray-600 mt-2">Track your milestones and deadlines</p>
        </div>
        <Button onClick={handleAddMilestone} className="mt-4 sm:mt-0">
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Milestone
        </Button>
      </div>
      
      {/* Timeline */}
      {milestones.length === 0 ? (
        <Empty
          title="No milestones yet"
          description="Create your first milestone to start tracking your wedding timeline."
          icon="Calendar"
          actionText="Add Milestone"
          onAction={handleAddMilestone}
        />
      ) : (
        <TimelineView
          milestones={milestones}
          onUpdateMilestone={handleUpdateMilestone}
        />
      )}
    </motion.div>
  )
}

export default Timeline