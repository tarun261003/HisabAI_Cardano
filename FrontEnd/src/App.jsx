import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import UploadPage from './pages/UploadPage'
import ProcessingPage from './pages/ProcessingPage'
import ResultPage from './pages/ResultPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/upload" replace />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/processing" element={<ProcessingPage />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </Router>
  )
}

export default App

