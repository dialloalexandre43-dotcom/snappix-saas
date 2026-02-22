'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function TestJobPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string>('')
  const [formData, setFormData] = useState({
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
    style: 'Fond blanc studio',
    ratio: '1:1',
  })

  if (status === 'loading') {
    return <div className="min-h-screen p-8">Chargement...</div>
  }

  if (status === 'unauthenticated') {
    router.push('/login')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult('Création du job en cours...')

    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setResult(`Erreur: ${data.error || 'Une erreur est survenue'}`)
        return
      }

      setResult(`✅ Job créé avec succès!\nJob ID: ${data.jobId}\n\nRedirection vers le dashboard...`)
      
      // Rediriger vers le dashboard après 2 secondes
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (error: any) {
      setResult(`Erreur: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Tester la création d'un job</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <p className="text-sm text-gray-600 mb-4">
            Connecté en tant que: <strong>{session?.user?.email}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
              URL de l'image source
            </label>
            <input
              id="imageUrl"
              type="url"
              required
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="style" className="block text-sm font-medium text-gray-700 mb-1">
              Style
            </label>
            <select
              id="style"
              required
              value={formData.style}
              onChange={(e) => setFormData({ ...formData, style: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Fond blanc studio">Fond blanc studio</option>
              <option value="Lifestyle salon">Lifestyle salon</option>
              <option value="Fond coloré social">Fond coloré social</option>
            </select>
          </div>

          <div>
            <label htmlFor="ratio" className="block text-sm font-medium text-gray-700 mb-1">
              Format d'image
            </label>
            <select
              id="ratio"
              required
              value={formData.ratio}
              onChange={(e) => setFormData({ ...formData, ratio: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="1:1">1:1 (Carré)</option>
              <option value="4:5">4:5 (Portrait)</option>
              <option value="16:9">16:9 (Paysage)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Création en cours...' : 'Créer un job'}
          </button>
        </form>

        {result && (
          <div className="mt-6 bg-gray-100 rounded-lg p-4">
            <pre className="whitespace-pre-wrap text-sm">{result}</pre>
          </div>
        )}

        <div className="mt-6 text-center">
          <a
            href="/dashboard"
            className="text-blue-600 hover:text-blue-700 underline"
          >
            ← Retour au dashboard
          </a>
        </div>
      </div>
    </div>
  )
}






















