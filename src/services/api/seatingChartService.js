import mockData from '@/services/mockData/seatingChart.json'

// Store data in memory (in a real app, this would be localStorage or backend)
let seatingChartData = { ...mockData }

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const getSeatingChart = async () => {
  await delay(300)
  
  // Return a copy to prevent direct mutation
  return {
    ...seatingChartData,
    tables: [...seatingChartData.tables],
    unassignedGuests: [...seatingChartData.unassignedGuests]
  }
}

export const updateSeatingChart = async (chartData) => {
  await delay(200)
  
  // Validate data structure
  if (!chartData || !Array.isArray(chartData.tables)) {
    throw new Error('Invalid seating chart data')
  }
  
  // Update stored data
  seatingChartData = {
    ...chartData,
    tables: chartData.tables.map(table => ({
      ...table,
      Id: parseInt(table.Id),
      number: parseInt(table.number)
    })),
    unassignedGuests: [...(chartData.unassignedGuests || [])]
  }
  
  return { ...seatingChartData }
}

export const addTable = async (tableData) => {
  await delay(200)
  
  // Generate new ID
  const maxId = Math.max(...seatingChartData.tables.map(t => t.Id), 0)
  const newTable = {
    Id: maxId + 1,
    number: Math.max(...seatingChartData.tables.map(t => t.number), 0) + 1,
    x: 200,
    y: 200,
    width: 120,
    height: 120,
    shape: 'round',
    capacity: 8,
    ...tableData
  }
  
  seatingChartData.tables.push(newTable)
  
  return { ...newTable }
}

export const deleteTable = async (id) => {
  await delay(200)
  
  const tableId = parseInt(id)
  if (!tableId) {
    throw new Error('Invalid table ID')
  }
  
  const tableIndex = seatingChartData.tables.findIndex(t => t.Id === tableId)
  if (tableIndex === -1) {
    throw new Error('Table not found')
  }
  
  seatingChartData.tables.splice(tableIndex, 1)
  
  return { success: true }
}

export const assignGuestToTable = async (guestId, tableNumber) => {
  await delay(200)
  
  // This would typically update the guest's tableNumber in the guest service
  // For now, we'll just return success
  return { success: true }
}