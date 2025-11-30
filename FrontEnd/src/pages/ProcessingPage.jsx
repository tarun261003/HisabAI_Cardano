import { useEffect, useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import apiClient from '../config/axios'

function ProcessingPage() {
  const navigate = useNavigate()
  const location = useLocation()
  // Support both jobId (normal mode) and job_id (dev mode)
  const jobId = location.state?.jobId || location.state?.job_id
  const [status, setStatus] = useState('Initializing...')
  const [error, setError] = useState(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    // If no jobId, redirect back to upload
    if (!jobId) {
      navigate('/upload')
      return
    }

    // Function to check job status
    const checkStatus = async () => {
      try {
        console.log(`Checking status for job: ${jobId}`)
        const response = await apiClient.get(`/status/${jobId}`, {
          timeout: 30000,
          validateStatus: (status) => status < 500 // Don't throw for 4xx errors
        })
        
        console.log('Status response:', response.data)
        const data = response.data

        // Update status text if available
        if (data.status) {
          const statusMessage = `Status: ${data.status}${data.message ? ` - ${data.message}` : ''}`
          setStatus(statusMessage)
          console.log(statusMessage)
        }

        // If status is "completed", navigate to result page with result data
        if (data.status === 'completed') {
          console.log('Job completed successfully')
          console.log('Raw API response data:', JSON.stringify(data, null, 2))
          
          // Check if we have valid result data
          if (!data.result || !data.result.structured) {
            console.error('Invalid result data in API response', data)
            setError('Received invalid result from server. Please try again.')
            if (intervalRef.current) {
              clearInterval(intervalRef.current)
            }
            return
          }
          
          // Construct the result object for ResultPage
          const resultData = {
            ...data.result.structured,
            hash: data.hash,
            ocr_text: data.result.ocr_text
          }

          console.log('Navigating to result with data:', resultData)
          
          // Clear the interval
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
          }
          // Navigate to result page with processed data
          navigate('/result', { state: { data: resultData, jobId } })
        } else if (data.status === 'error') {
            console.error('Job processing failed:', data.message || 'Unknown error')
            setError(`Job processing failed: ${data.message || 'Unknown error'}`)
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
      } catch (err) {
        const errorMessage = `Error checking status: ${err.message || 'Unknown error'}`
        console.error(errorMessage, {
          name: err.name,
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          config: {
            url: err.config?.url,
            method: err.config?.method,
          }
        })
        setStatus(`Error: ${errorMessage}`)
        
        // If we get a 404, the job might not exist or was deleted
        if (err.response?.status === 404) {
          setError('Job not found. It may have expired or been deleted.')
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
          }
        }
      }
    }

    // Initial check
    checkStatus()

    // Set up polling every 2 seconds
    intervalRef.current = setInterval(checkStatus, 2000)

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [navigate, jobId])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="mb-8">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-fintech-blue-200 border-t-fintech-blue-600"></div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Processing Your Document
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          {status}
        </p>
        
        {error ? (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
            <button
              onClick={() => navigate('/upload')}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-fintech-blue-500 rounded-full animate-pulse"></div>
              <span>Processing in progress...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProcessingPage
