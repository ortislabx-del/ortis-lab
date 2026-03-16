import { Metadata } from 'next'
import AuthForm from '@/components/auth-form'

export const metadata: Metadata = {
  title: 'Connexion - Kitchen Tech Sheets',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-800">🍽️ Kitchen Tech Sheets</h1>
          <p className="text-gray-500 mt-2">Gestion des fiches techniques de cuisine</p>
        </div>
        <AuthForm />
      </div>
    </div>
  )
}
