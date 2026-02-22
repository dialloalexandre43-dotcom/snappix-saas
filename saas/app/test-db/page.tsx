'use client'

import { useState } from 'react'

export default function TestDBPage() {
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setResult('Test en cours...')
    
    try {
      const response = await fetch('/api/test-db')
      const data = await response.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (error: any) {
      setResult(`Erreur: ${error?.message || String(error)}\n\nVérifiez la console du navigateur (F12) pour plus de détails.`)
      console.error('Erreur de test:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Test de connexion DB</h1>
      <button
        onClick={testConnection}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Test en cours...' : 'Tester la connexion'}
      </button>
      <pre className="mt-4 p-4 bg-gray-100 rounded overflow-auto">
        {result || 'Cliquez sur le bouton pour tester'}
      </pre>
    </div>
  )
}

