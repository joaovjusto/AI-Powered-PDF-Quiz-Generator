import Cookies from 'js-cookie'
import { v4 as uuidv4 } from 'uuid'

const SESSION_COOKIE_NAME = 'quiz_session_token'
const SESSION_COOKIE_EXPIRES = 2 // hours

export const sessionService = {
  getSessionToken: (): string => {
    let token = Cookies.get(SESSION_COOKIE_NAME)
    
    if (!token) {
      token = uuidv4()
      Cookies.set(SESSION_COOKIE_NAME, token, {
        expires: new Date(new Date().getTime() + SESSION_COOKIE_EXPIRES * 60 * 60 * 1000),
        secure: true,
        sameSite: 'strict'
      })
    }
    
    return token
  },

  clearSession: () => {
    Cookies.remove(SESSION_COOKIE_NAME)
  }
}