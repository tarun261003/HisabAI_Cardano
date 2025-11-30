// Developer mode configuration
export const DEV_MODE_ENABLED = import.meta.env.VITE_DEV_MODE === 'true' || false

// Mock receipt data for developer mode
export const MOCK_RECEIPT_DATA = {
  vendor: 'Sample Store Inc.',
  date: new Date().toISOString(),
  total: '125.50',
  tax: '10.04',
  category: 'Office Supplies',
  hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  status: 'done',
  status_text: 'Processing complete'
}

// Check if backend is reachable
export const checkBackendReachable = async (baseURL = 'http://localhost:8000') => {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 second timeout
    
    // Try health endpoint first, fallback to root if health doesn't exist
    try {
      const response = await fetch(`${baseURL}/health`, {
        method: 'GET',
        signal: controller.signal,
        mode: 'cors'
      })
      clearTimeout(timeoutId)
      return response.ok
    } catch (healthError) {
      // If health endpoint fails, try root endpoint
      clearTimeout(timeoutId)
      const rootController = new AbortController()
      const rootTimeoutId = setTimeout(() => rootController.abort(), 3000)
      
      try {
        const response = await fetch(baseURL, {
          method: 'GET',
          signal: rootController.signal,
          mode: 'cors'
        })
        clearTimeout(rootTimeoutId)
        return response.status < 500 // Any response < 500 means server is reachable
      } catch (rootError) {
        clearTimeout(rootTimeoutId)
        return false
      }
    }
  } catch (error) {
    // Backend is not reachable
    return false
  }
}

