import tasksData from '@/services/mockData/tasks.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const getTasks = async () => {
  await delay(300)
  return [...tasksData]
}

export const getTaskById = async (id) => {
  await delay(200)
  const task = tasksData.find(t => t.Id === id)
  if (!task) {
    throw new Error('Task not found')
  }
  return { ...task }
}

export const updateTask = async (id, updates) => {
  await delay(250)
  const index = tasksData.findIndex(t => t.Id === id)
  if (index === -1) {
    throw new Error('Task not found')
  }
  tasksData[index] = { ...tasksData[index], ...updates }
  return { ...tasksData[index] }
}

export const createTask = async (task) => {
  await delay(300)
  const newId = Math.max(...tasksData.map(t => t.Id)) + 1
  const newTask = { ...task, Id: newId }
  tasksData.push(newTask)
  return newTask
}

export const deleteTask = async (id) => {
  await delay(200)
  const index = tasksData.findIndex(t => t.Id === id)
  if (index === -1) {
    throw new Error('Task not found')
  }
  tasksData.splice(index, 1)
  return true
}