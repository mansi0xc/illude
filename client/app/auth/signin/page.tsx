"use client"

import { signIn, getProviders } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface Provider {
  id: string
  name: string
  type: string
  signinUrl: string
  callbackUrl: string
}

export default function SignIn() {
  const [providers, setProviders] = useState<Record<string, Provider> | null>(null)

  useEffect(() => {
    const setAuthProviders = async () => {
      const res = await getProviders()
      setProviders(res)
    }
    setAuthProviders()
  }, [])

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 text-emerald-400 hover:text-emerald-300 transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-black" />
            </div>
            <span className="text-3xl font-bold">Illude</span>
          </div>
          
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-gray-400">
            Sign in to continue your storytelling journey
          </p>
        </div>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-center text-white">Choose Sign In Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {providers &&
              Object.values(providers).map((provider) => (
                <div key={provider.name}>
                  <Button
                    onClick={() => signIn(provider.id, { callbackUrl: '/' })}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-md"
                  >
                    Sign in with {provider.name}
                  </Button>
                </div>
              ))}
            
            {!providers && (
              <div className="text-center py-4">
                <Sparkles className="w-6 h-6 text-emerald-400 animate-spin mx-auto mb-2" />
                <p className="text-gray-400">Loading sign-in options...</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-gray-400">
          <p>
            By signing in, you agree to our{" "}
            <a href="#" className="text-emerald-400 hover:text-emerald-300">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-emerald-400 hover:text-emerald-300">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  )
} 