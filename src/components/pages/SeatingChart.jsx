import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import jsPDF from 'jspdf'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { getSeatingChart, updateSeatingChart } from '@/services/api/seatingChartService'
import { getGuests } from '@/services/api/guestService'

const SeatingChart = () => {
  const navigate = useNavigate()
  const canvasRef = useRef(null)
  const [seatingData, setSeatingData] = useState(null)
  const [guests, setGuests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [draggedItem, setDraggedItem] = useState(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 })

  useEffect(() => {
    loadData()
    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)
    return () => window.removeEventListener('resize', updateCanvasSize)
  }, [])

const updateCanvasSize = () => {
    const container = canvasRef.current?.parentElement
    if (container && canvasRef.current) {
      const rect = container.getBoundingClientRect()
      const width = Math.max(Math.min(rect.width - 48, 1200), 400) // Minimum 400px width
      const height = Math.max(Math.min(width * 0.75, 800), 300) // Minimum 300px height
      
      // Ensure canvas has valid dimensions before setting
      if (width > 0 && height > 0) {
        setCanvasSize({ width, height })
        // Update canvas element dimensions immediately
        canvasRef.current.width = width
        canvasRef.current.height = height
      }
    }
  }

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      const [chartData, guestData] = await Promise.all([
        getSeatingChart(),
        getGuests()
      ])
      setSeatingData(chartData)
      setGuests(guestData.filter(g => g.rsvpStatus === 'Confirmed'))
    } catch (err) {
      setError(err.message || 'Failed to load seating chart')
      toast.error('Failed to load seating chart')
    } finally {
      setLoading(false)
    }
  }

  const drawCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas || !seatingData) return

    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw background
    ctx.fillStyle = '#FAF9F7'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    ctx.strokeStyle = '#E5E7EB'
    ctx.lineWidth = 1
    for (let x = 0; x <= canvas.width; x += 50) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }
    for (let y = 0; y <= canvas.height; y += 50) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }

    // Draw tables
    seatingData.tables.forEach(table => {
      drawTable(ctx, table)
    })

    // Draw unassigned guests
    seatingData.unassignedGuests.forEach((guest, index) => {
      drawGuestCard(ctx, guest, 20 + (index % 3) * 140, 20 + Math.floor(index / 3) * 60, false)
    })
  }

  const drawTable = (ctx, table) => {
    const { x, y, width, height, shape, number } = table

    // Table background
    ctx.fillStyle = draggedItem?.type === 'table' && draggedItem.id === table.Id ? '#E8B4B8' : '#FFFFFF'
    ctx.strokeStyle = '#D4A574'
    ctx.lineWidth = 2

    if (shape === 'round') {
      const radius = Math.min(width, height) / 2
      ctx.beginPath()
      ctx.arc(x + radius, y + radius, radius, 0, 2 * Math.PI)
      ctx.fill()
      ctx.stroke()
    } else {
      ctx.fillRect(x, y, width, height)
      ctx.strokeRect(x, y, width, height)
    }

    // Table number
    ctx.fillStyle = '#374151'
    ctx.font = 'bold 16px Inter'
    ctx.textAlign = 'center'
    ctx.fillText(`Table ${number}`, x + width/2, y + height/2 + 5)

    // Draw guests at this table
    const tableGuests = guests.filter(g => g.tableNumber === number)
    tableGuests.forEach((guest, index) => {
      const angle = (index / tableGuests.length) * 2 * Math.PI
      const radius = Math.max(width, height) / 2 + 40
      const guestX = x + width/2 + Math.cos(angle) * radius - 60
      const guestY = y + height/2 + Math.sin(angle) * radius - 20
      drawGuestCard(ctx, guest, guestX, guestY, true)
    })
  }

  const drawGuestCard = (ctx, guest, x, y, isAssigned) => {
    const width = 120
    const height = 40

    // Card background
    ctx.fillStyle = draggedItem?.type === 'guest' && draggedItem.id === guest.Id ? 
      '#D4A574' : (isAssigned ? '#7FB069' : '#F8E5D6')
    ctx.strokeStyle = isAssigned ? '#6ba05a' : '#D4A574'
    ctx.lineWidth = 1
    ctx.fillRect(x, y, width, height)
    ctx.strokeRect(x, y, width, height)

    // Guest name
    ctx.fillStyle = isAssigned ? '#FFFFFF' : '#374151'
    ctx.font = '12px Inter'
    ctx.textAlign = 'left'
    ctx.fillText(guest.name, x + 8, y + 16)

    // Plus one indicator
    if (guest.plusOne) {
      ctx.fillStyle = isAssigned ? 'rgba(255,255,255,0.8)' : '#6B7280'
      ctx.font = '10px Inter'
      ctx.fillText('+1', x + 8, y + 32)
    }
  }

  useEffect(() => {
    drawCanvas()
  }, [seatingData, guests, draggedItem, canvasSize])

  const getItemAtPosition = (x, y) => {
    if (!seatingData) return null

    // Check tables
    for (const table of seatingData.tables) {
      if (x >= table.x && x <= table.x + table.width && 
          y >= table.y && y <= table.y + table.height) {
        return { type: 'table', id: table.Id, item: table }
      }
    }

    // Check unassigned guests
    seatingData.unassignedGuests.forEach((guest, index) => {
      const guestX = 20 + (index % 3) * 140
      const guestY = 20 + Math.floor(index / 3) * 60
      if (x >= guestX && x <= guestX + 120 && y >= guestY && y <= guestY + 40) {
        return { type: 'guest', id: guest.Id, item: guest }
      }
    })

    // Check assigned guests
    for (const table of seatingData.tables) {
      const tableGuests = guests.filter(g => g.tableNumber === table.number)
      for (let i = 0; i < tableGuests.length; i++) {
        const guest = tableGuests[i]
        const angle = (i / tableGuests.length) * 2 * Math.PI
        const radius = Math.max(table.width, table.height) / 2 + 40
        const guestX = table.x + table.width/2 + Math.cos(angle) * radius - 60
        const guestY = table.y + table.height/2 + Math.sin(angle) * radius - 20
        
        if (x >= guestX && x <= guestX + 120 && y >= guestY && y <= guestY + 40) {
          return { type: 'guest', id: guest.Id, item: guest }
        }
      }
    }

    return null
  }

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const item = getItemAtPosition(x, y)
    if (item) {
      setDraggedItem(item)
      setDragOffset({ x: x - (item.item.x || 0), y: y - (item.item.y || 0) })
    }
  }

  const handleMouseMove = (e) => {
    if (!draggedItem) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left - dragOffset.x
    const y = e.clientY - rect.top - dragOffset.y

    if (draggedItem.type === 'table') {
      setSeatingData(prev => ({
        ...prev,
        tables: prev.tables.map(table => 
          table.Id === draggedItem.id ? { ...table, x, y } : table
        )
      }))
    }
  }

  const handleMouseUp = async () => {
    if (draggedItem) {
      try {
        await updateSeatingChart(seatingData)
        toast.success('Seating arrangement saved')
      } catch (err) {
        toast.error('Failed to save arrangement')
      }
      setDraggedItem(null)
    }
  }

  const handleAddTable = () => {
    const newTable = {
      Id: Math.max(...seatingData.tables.map(t => t.Id), 0) + 1,
      number: Math.max(...seatingData.tables.map(t => t.number), 0) + 1,
      x: 200,
      y: 200,
      width: 100,
      height: 100,
      shape: 'round',
      capacity: 8
    }

    setSeatingData(prev => ({
      ...prev,
      tables: [...prev.tables, newTable]
    }))
  }

const handleExportPDF = () => {
    try {
      const canvas = canvasRef.current
      
      // Validate canvas exists and has proper dimensions
      if (!canvas) {
        toast.error('Canvas not found - please wait for the chart to load')
        return
      }
      
      if (canvas.width === 0 || canvas.height === 0) {
        toast.error('Canvas not properly sized - please wait for the chart to render')
        return
      }
      
      // Ensure canvas has been drawn to
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        toast.error('Unable to access canvas context')
        return
      }
      
      const pdf = new jsPDF('landscape', 'mm', 'a4')
      
      // Add title
      pdf.setFontSize(20)
      pdf.text('Wedding Seating Chart', 20, 20)
      
      // Add canvas as image - with additional validation
      try {
        const imgData = canvas.toDataURL('image/png')
        if (!imgData || imgData === 'data:,') {
          throw new Error('Canvas is empty or not rendered')
        }
        pdf.addImage(imgData, 'PNG', 20, 30, 250, 180)
      } catch (canvasError) {
        console.error('Canvas export error:', canvasError)
        toast.error('Failed to capture seating chart - please ensure the chart is fully loaded')
        return
      }
      
      // Add guest list
      pdf.addPage()
      pdf.setFontSize(16)
      pdf.text('Guest List by Table', 20, 20)
      
      let yPos = 40
      seatingData.tables.forEach(table => {
        const tableGuests = guests.filter(g => g.tableNumber === table.number)
        if (tableGuests.length > 0) {
          pdf.setFontSize(12)
          pdf.text(`Table ${table.number}:`, 20, yPos)
          yPos += 10
          
          tableGuests.forEach(guest => {
            pdf.text(`• ${guest.name}${guest.plusOne ? ' (+1)' : ''}`, 25, yPos)
            yPos += 8
          })
          yPos += 5
        }
      })
      
      pdf.save('wedding-seating-chart.pdf')
      toast.success('Seating chart exported to PDF')
    } catch (err) {
      console.error('PDF export error:', err)
      toast.error(`Failed to export PDF: ${err.message || 'Unknown error'}`)
    }
  }

  if (loading) return <Loading type="page" />
  if (error) return <Error message={error} onRetry={loadData} />

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/guests')}
              className="p-1"
            >
              <ApperIcon name="ArrowLeft" className="w-4 h-4" />
            </Button>
            <h1 className="text-3xl font-bold font-display text-gray-900">Seating Chart</h1>
          </div>
          <p className="text-gray-600">Arrange your guests visually and export as PDF</p>
        </div>
        <div className="flex gap-3 mt-4 sm:mt-0">
          <Button onClick={handleAddTable} variant="secondary">
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add Table
          </Button>
          <Button onClick={handleExportPDF}>
            <ApperIcon name="Download" className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <Card className="p-6">
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          className="border border-gray-200 rounded-lg cursor-pointer w-full"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </Card>

      {/* Instructions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">How to use:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex items-start space-x-3">
            <ApperIcon name="MousePointer" className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium">Drag Tables</p>
              <p>Click and drag table shapes to reposition them on the chart</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <ApperIcon name="Users" className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium">Assign Guests</p>
              <p>Drag guest cards from the unassigned area to tables</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <ApperIcon name="Plus" className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium">Add Tables</p>
              <p>Use the "Add Table" button to create new seating areas</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <ApperIcon name="Download" className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium">Export PDF</p>
              <p>Generate a printable seating chart with guest lists</p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default SeatingChart