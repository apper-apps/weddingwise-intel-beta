import milestonesData from '@/services/mockData/milestones.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const getMilestones = async () => {
  await delay(300)
  return [...milestonesData]
}

export const getMilestoneById = async (id) => {
  await delay(200)
  const milestone = milestonesData.find(m => m.Id === id)
  if (!milestone) {
    throw new Error('Milestone not found')
  }
  return { ...milestone }
}

export const updateMilestone = async (id, updates) => {
  await delay(250)
  const milestone = milestonesData.find(m => m.Id === id)
  if (!milestone) {
    throw new Error('Milestone not found')
  }
  return { ...milestone, ...updates }
}

export const createMilestone = async (milestone) => {
  await delay(300)
  const newId = Math.max(...milestonesData.map(m => m.Id)) + 1
  const newMilestone = { ...milestone, Id: newId }
  milestonesData.push(newMilestone)
  return newMilestone
}

export const deleteMilestone = async (id) => {
  await delay(200)
  const index = milestonesData.findIndex(m => m.Id === id)
  if (index === -1) {
    throw new Error('Milestone not found')
  }
  milestonesData.splice(index, 1)
  return true
}