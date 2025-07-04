import { motion } from 'framer-motion'
import Chart from 'react-apexcharts'

const BudgetChart = ({ data }) => {
  const categories = data.map(item => item.category)
  const amounts = data.map(item => item.budgeted)
  const colors = ['#D4A574', '#E8B4B8', '#F8E5D6', '#7FB069', '#6B9BD1', '#F5A623']
  
  const chartOptions = {
    chart: {
      type: 'donut',
      toolbar: {
        show: false
      }
    },
    labels: categories,
    colors: colors,
    legend: {
      position: 'bottom',
      fontFamily: 'Inter, sans-serif'
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val.toFixed(1) + '%'
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: true,
              label: 'Total Budget',
              fontSize: '14px',
              color: '#374151',
              formatter: function (w) {
                const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0)
                return '$' + total.toLocaleString()
              }
            }
          }
        }
      }
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return '$' + val.toLocaleString()
        }
      }
    }
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-96"
    >
      <Chart
        options={chartOptions}
        series={amounts}
        type="donut"
        height="100%"
      />
    </motion.div>
  )
}

export default BudgetChart