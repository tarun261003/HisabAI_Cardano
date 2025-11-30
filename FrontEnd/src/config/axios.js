import axios from 'axios'

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: 'https://hisab-ai-agent-15544570732.asia-south1.run.app',
  timeout: 30000,
})

export default apiClient

