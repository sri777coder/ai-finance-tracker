import { useState } from "react"
import { uploadAPI } from "../services/api"
import { useNavigate } from "react-router-dom"

export default function Upload() {
  const [file, setFile]       = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult]   = useState(null)
  const [error, setError]     = useState("")
  const [dragging, setDragging] = useState(false)
  const navigate = useNavigate()

  const handleUpload = async () => {
    if (!file) return
    setLoading(true); setError("")
    try {
      const res = await uploadAPI.uploadCSV(file)
      setResult(res.data)
    } catch (err) {
      setError(err.response?.data?.detail || "Upload failed")
    } finally { setLoading(false) }
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Upload CSV</h1>
          <p className="text-gray-400 text-sm mt-1">Upload your bank export — needs date, description, amount columns</p>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); setFile(e.dataTransfer.files[0]) }}
          className={`bg-white border-2 border-dashed rounded-2xl p-16 text-center transition-all mb-6
            ${dragging ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-indigo-300"}`}>

          <div className="text-5xl mb-4">📄</div>
          <p className="text-gray-700 font-medium mb-1">Drag & drop your CSV here</p>
          <p className="text-gray-400 text-sm mb-6">or click to browse files</p>

          <input type="file" accept=".csv" onChange={e => { setFile(e.target.files[0]); setResult(null) }}
            className="hidden" id="file-input" />
          <label htmlFor="file-input"
            className="cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
            Choose File
          </label>

          {file && (
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-indigo-600 font-medium">
              <span>📎</span> {file.name}
              <span className="text-gray-400">({(file.size / 1024).toFixed(1)} KB)</span>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-4 text-sm">{error}</div>
        )}

        {result && (
          <div className="bg-green-50 border border-green-200 p-6 rounded-xl mb-4">
            <div className="text-green-700 font-semibold text-lg mb-1">✅ {result.message}</div>
            <p className="text-green-600 text-sm mb-4">AI has classified all transactions and detected anomalies</p>
            <button onClick={() => navigate("/analytics")}
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-500 transition-colors">
              View Analytics →
            </button>
          </div>
        )}

        <button onClick={handleUpload} disabled={!file || loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed">
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Processing with AI...
            </span>
          ) : "Upload & Analyze →"}
        </button>

        {/* CSV format hint */}
        <div className="mt-6 bg-white border border-gray-100 rounded-xl p-4">
          <p className="text-xs text-gray-500 font-medium mb-2">CSV FORMAT REQUIRED</p>
          <code className="text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded block">
            date, description, amount<br/>
            2024-01-15, ZOMATO ORDER #123, 450.00
          </code>
        </div>
      </div>
    </div>
  )
}