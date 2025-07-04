import { useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'
import SearchBar from '@/components/molecules/SearchBar'
import FilterDropdown from '@/components/molecules/FilterDropdown'

const GuestTable = ({ guests, onUpdateGuest, onDeleteGuest }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  
  const filteredGuests = guests.filter(guest => {
    const matchesSearch = guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guest.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || guest.rsvpStatus === statusFilter
    return matchesSearch && matchesStatus
  })
  
  const rsvpStatusOptions = ['', 'Pending', 'Confirmed', 'Declined']
  
  const getStatusBadge = (status) => {
    const variants = {
      'Pending': 'warning',
      'Confirmed': 'success',
      'Declined': 'error'
    }
    return variants[status] || 'info'
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar
          placeholder="Search guests..."
          onSearch={setSearchTerm}
          className="flex-1"
        />
        <FilterDropdown
          options={rsvpStatusOptions}
          selected={statusFilter}
          onSelect={setStatusFilter}
          placeholder="Filter by RSVP"
          className="w-full sm:w-48"
        />
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-surface rounded-lg shadow-lg">
          <thead className="bg-gradient-to-r from-secondary to-accent/20">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Name</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Email</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">RSVP Status</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Plus One</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Table</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredGuests.map((guest, index) => (
              <motion.tr
                key={guest.Id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-secondary/30 transition-colors duration-200"
              >
                <td className="px-6 py-4 text-sm text-gray-900">{guest.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{guest.email}</td>
                <td className="px-6 py-4">
                  <Badge variant={getStatusBadge(guest.rsvpStatus)}>
                    {guest.rsvpStatus}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  {guest.plusOne ? (
                    <ApperIcon name="Check" className="w-5 h-5 text-success" />
                  ) : (
                    <ApperIcon name="X" className="w-5 h-5 text-gray-400" />
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {guest.tableNumber || 'Not assigned'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onUpdateGuest(guest.Id)}
                      className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors duration-200"
                    >
                      <ApperIcon name="Edit" className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteGuest(guest.Id)}
                      className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors duration-200"
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

export default GuestTable