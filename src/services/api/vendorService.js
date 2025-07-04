import vendorsData from '@/services/mockData/vendors.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const getVendors = async () => {
  await delay(300)
  return [...vendorsData]
}

export const getVendorById = async (id) => {
  await delay(200)
  const vendor = vendorsData.find(v => v.Id === id)
  if (!vendor) {
    throw new Error('Vendor not found')
  }
  return { ...vendor }
}

export const updateVendor = async (id, updates) => {
  await delay(250)
  const vendor = vendorsData.find(v => v.Id === id)
  if (!vendor) {
    throw new Error('Vendor not found')
  }
  return { ...vendor, ...updates }
}

export const createVendor = async (vendor) => {
  await delay(300)
  const newId = Math.max(...vendorsData.map(v => v.Id)) + 1
  const newVendor = { ...vendor, Id: newId }
  vendorsData.push(newVendor)
  return newVendor
}

export const deleteVendor = async (id) => {
  await delay(200)
  const index = vendorsData.findIndex(v => v.Id === id)
  if (index === -1) {
    throw new Error('Vendor not found')
  }
  vendorsData.splice(index, 1)
  return true
}