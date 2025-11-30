import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../config/axios'

function UploadPage() {
  const navigate = useNavigate()
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileSelect = (file) => {
    if (file && (file.type.startsWith('image/') || file.type === 'application/pdf')) {
      setSelectedFile(file)
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreview(reader.result)
        }
        reader.readAsDataURL(file)
      } else {
        setPreview(null)
      }
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleFileInputChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleContinue = async () => {
    if (!selectedFile) {
      console.error('No file selected')
      return
    }

    setIsUploading(true)
    
    try {
      console.log('Preparing to upload file:', selectedFile.name, 'Size:', selectedFile.size, 'bytes')
      const formData = new FormData()
      formData.append('file', selectedFile)

      console.log('Sending request to /start_job endpoint...')
      const response = await apiClient.post('/start_job', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // Increase timeout to 60 seconds
      })

      console.log('Response received:', response)
      
      if (!response.data || !response.data.job_id) {
        throw new Error('Invalid response format: missing job_id')
      }

      const jobId = response.data.job_id
      console.log('Job started with ID:', jobId)
      
      // Navigate to processing page with job_id in state
      navigate('/processing', { state: { jobId } })
    } catch (error) {
      console.error('Error uploading file:', {
        name: error.name,
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
        }
      })
      alert(`Failed to upload file: ${error.message}. Please check the console for more details.`)
      setIsUploading(false)
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Upload Your Document
          </h1>
          <p className="text-lg text-gray-600">
            Upload your financial document to get started with AI-powered processing
          </p>
        </div>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`bg-white border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
            isDragging
              ? 'border-fintech-blue-500 bg-fintech-blue-50'
              : 'border-fintech-blue-300 hover:border-fintech-blue-500'
          }`}
        >
          {!selectedFile ? (
            <>
              <div className="mb-6">
                <svg
                  className="mx-auto h-16 w-16 text-fintech-blue-500"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="mb-6">
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-fintech-blue-600 hover:bg-fintech-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fintech-blue-500"
                >
                  <span>Select a file</span>
                  <input
                    id="file-upload"
                    ref={fileInputRef}
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept="image/*,.pdf"
                    onChange={handleFileInputChange}
                  />
                </label>
              </div>
              <p className="text-sm text-gray-500">
                Drag and drop your file here, or click to select
              </p>
              <p className="text-xs text-gray-400 mt-2">
                PDF, PNG, JPG up to 10MB
              </p>
            </>
          ) : (
            <div className="space-y-4">
              {preview ? (
                <div className="mb-6">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-96 mx-auto rounded-lg shadow-md"
                  />
                </div>
              ) : (
                <div className="mb-6">
                  <div className="mx-auto w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="h-16 w-16 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
              )}
              <div className="text-center">
                <p className="text-sm font-medium text-gray-900 mb-2">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <button
                  onClick={handleRemoveFile}
                  className="text-sm text-fintech-blue-600 hover:text-fintech-blue-700 font-medium"
                >
                  Remove file
                </button>
              </div>
            </div>
          )}
        </div>

        {selectedFile && (
          <div className="mt-8 text-center">
            <button
              onClick={handleContinue}
              disabled={isUploading}
              className="px-8 py-3 bg-fintech-blue-600 text-white font-semibold rounded-lg hover:bg-fintech-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fintech-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Uploading...' : 'Continue'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default UploadPage
