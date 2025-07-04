import weddingData from '@/services/mockData/wedding.json'
import tasksData from '@/services/mockData/tasks.json'
import guestsData from '@/services/mockData/guests.json'
import vendorsData from '@/services/mockData/vendors.json'
import budgetData from '@/services/mockData/budget.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const getWeddingData = async () => {
  await delay(300)
  return weddingData
}

export const getTasks = async () => {
  await delay(250)
  return [...tasksData]
}

export const getGuests = async () => {
  await delay(200)
  return [...guestsData]
}

export const getVendors = async () => {
  await delay(300)
  return [...vendorsData]
}

export const getBudgetItems = async () => {
  await delay(250)
  return [...budgetData]
}