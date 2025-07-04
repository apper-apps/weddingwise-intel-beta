import budgetData from '@/services/mockData/budget.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const getBudgetItems = async () => {
  await delay(300)
  return [...budgetData]
}

export const getBudgetItemById = async (id) => {
  await delay(200)
  const item = budgetData.find(b => b.Id === id)
  if (!item) {
    throw new Error('Budget item not found')
  }
  return { ...item }
}

export const updateBudgetItem = async (id, updates) => {
  await delay(250)
  const item = budgetData.find(b => b.Id === id)
  if (!item) {
    throw new Error('Budget item not found')
  }
  return { ...item, ...updates }
}

export const createBudgetItem = async (item) => {
  await delay(300)
  const newId = Math.max(...budgetData.map(b => b.Id)) + 1
  const newItem = { ...item, Id: newId }
  budgetData.push(newItem)
  return newItem
}

export const deleteBudgetItem = async (id) => {
  await delay(200)
  const index = budgetData.findIndex(b => b.Id === id)
  if (index === -1) {
    throw new Error('Budget item not found')
  }
  budgetData.splice(index, 1)
  return true
}