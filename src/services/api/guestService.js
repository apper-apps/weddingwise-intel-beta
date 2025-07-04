import guestsData from '@/services/mockData/guests.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const getGuests = async () => {
  await delay(300)
  return [...guestsData]
}

export const getGuestById = async (id) => {
  await delay(200)
  const guest = guestsData.find(g => g.Id === id)
  if (!guest) {
    throw new Error('Guest not found')
  }
  return { ...guest }
}

export const updateGuest = async (id, updates) => {
  await delay(250)
  const guest = guestsData.find(g => g.Id === id)
  if (!guest) {
    throw new Error('Guest not found')
  }
  return { ...guest, ...updates }
}

export const createGuest = async (guest) => {
  await delay(300)
  const newId = Math.max(...guestsData.map(g => g.Id)) + 1
  const newGuest = { ...guest, Id: newId }
  guestsData.push(newGuest)
  return newGuest
}

export const deleteGuest = async (id) => {
  await delay(200)
  const index = guestsData.findIndex(g => g.Id === id)
  if (index === -1) {
    throw new Error('Guest not found')
  }
  guestsData.splice(index, 1)
  return true
}