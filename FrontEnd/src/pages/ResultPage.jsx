import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

function ResultPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const receiptData = location.state?.data || {}
  // Redirect to upload if no state data is received
  useEffect(() => {
    if (!location.state?.data) {
      navigate('/upload', { replace: true })
    }
  }, [navigate, location.state])

  // Extract receipt fields with fallback values
  const vendor = receiptData.vendor || 'N/A'
  const date = receiptData.date || 'N/A'
  const total = receiptData.total || '0.00'
  const tax = receiptData.tax || '0.00'
  const category = receiptData.category || 'N/A'
  const hash = receiptData.hash || 'N/A'

  // Format date if it's a valid date string
  const formatDate = (dateString) => {
    if (dateString === 'N/A') return 'N/A'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  // Format currency
  const formatCurrency = (amount) => {
    if (typeof amount === 'number') {
      return `${amount.toFixed(2)}`
    }
    if (typeof amount === 'string') {
      const num = parseFloat(amount)
      return isNaN(num) ? amount : `${num.toFixed(2)}`
    }
    return amount
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Receipt Details
          </h1>
          <p className="text-lg text-gray-600">
            Your receipt has been successfully processed
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Receipt Information</h2>
            <div className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              Logged on Cardano
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vendor Card */}
            <div className="bg-fintech-blue-50 rounded-lg p-6">
              <div className="text-sm font-medium text-fintech-blue-600 mb-2">
                Vendor
              </div>
              <div className="text-xl font-semibold text-gray-900">
                {vendor}
              </div>
            </div>

            {/* Date Card */}
            <div className="bg-fintech-blue-50 rounded-lg p-6">
              <div className="text-sm font-medium text-fintech-blue-600 mb-2">
                Date
              </div>
              <div className="text-xl font-semibold text-gray-900">
                {formatDate(date)}
              </div>
            </div>

            {/* Total Card */}
            <div className="bg-fintech-blue-50 rounded-lg p-6">
              <div className="text-sm font-medium text-fintech-blue-600 mb-2">
                Total
              </div>
              <div className="text-xl font-semibold text-gray-900">
                &#8377;{formatCurrency(total)}
              </div>
            </div>

            {/* Tax Card */}
            <div className="bg-fintech-blue-50 rounded-lg p-6">
              <div className="text-sm font-medium text-fintech-blue-600 mb-2">
                Tax
              </div>
              <div className="text-xl font-semibold text-gray-900">
                &#8377;{formatCurrency(tax)}
              </div>
            </div>

            {/* Category Card */}
            <div className="bg-fintech-blue-50 rounded-lg p-6">
              <div className="text-sm font-medium text-fintech-blue-600 mb-2">
                Category
              </div>
              <div className="text-xl font-semibold text-gray-900">
                {category}
              </div>
            </div>

            {/* Hash Card */}
            <div className="bg-fintech-blue-50 rounded-lg p-6">
              <div className="text-sm font-medium text-fintech-blue-600 mb-2">
                Hash
              </div>
              <div className="text-sm font-mono text-gray-900 break-all">
                {hash}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate('/upload')}
            className="px-8 py-3 bg-fintech-blue-600 text-white font-semibold rounded-lg hover:bg-fintech-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fintech-blue-500 transition-colors"
          >
            Upload another receipt
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResultPage
