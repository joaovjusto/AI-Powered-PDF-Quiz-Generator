import Cookies from 'js-cookie'
import { v4 as uuidv4 } from 'uuid'

const SESSION_COOKIE_NAME = 'quiz_session_token'
const SESSION_EXPIRATION_HOURS = 2

export function getSessionId(): string | undefined {
  return Cookies.get(SESSION_COOKIE_NAME)
}

export function setSessionId(): string {
  const newSessionId = uuidv4()
  Cookies.set(SESSION_COOKIE_NAME, newSessionId, {
    expires: SESSION_EXPIRATION_HOURS / 24, // Convert hours to days
    secure: process.env.NODE_ENV === 'production', // Use secure in production
    sameSite: 'Strict', // Protect against CSRF
  })
  return newSessionId
}

export function removeSessionId(): void {
  Cookies.remove(SESSION_COOKIE_NAME)
}