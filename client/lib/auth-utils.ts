import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth"

export async function getServerAuthSession() {
  return await getServerSession(authOptions)
}

export async function requireAuth() {
  const session = await getServerAuthSession()
  
  if (!session || !session.user) {
    throw new Error('Authentication required')
  }
  
  return session
}

export async function getUserFromRequest() {
  try {
    const session = await getServerAuthSession()
    return session?.user || null
  } catch (error) {
    console.error('Error getting user from request:', error)
    return null
  }
} 