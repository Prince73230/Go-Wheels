import crypto from 'crypto'

function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET

  if (!secret) {
    throw new Error('AUTH_SECRET must be set in the environment')
  }

  return secret
}

const AUTH_SECRET = getAuthSecret()

const COOKIE_NAME = 'gowheels_session'

type SessionData = {
  userId: number
  isAdmin: boolean
}

function createSignature(data: string) {
  return crypto
    .createHmac('sha256', AUTH_SECRET)
    .update(data)
    .digest('base64url')
}

// ==========================================
// CREATE SESSION
// ==========================================

export function createSession(
  userId: number,
  isAdmin: boolean = false
) {
  const data = Buffer.from(
    JSON.stringify({
      userId,
      isAdmin,
    })
  ).toString('base64url')

  const signature = createSignature(data)

  return `${data}.${signature}`
}

// ==========================================
// VERIFY SESSION
// ==========================================

export function verifySession(
  token: string | undefined
) {
  if (!token) {
    return null
  }

  try {
    const [data, signature] = token.split('.')

    if (!data || !signature) {
      return null
    }

    const expectedSignature =
      createSignature(data)

    const signatureBuffer =
      Buffer.from(signature)

    const expectedBuffer =
      Buffer.from(expectedSignature)

    if (
      signatureBuffer.length !==
        expectedBuffer.length ||
      !crypto.timingSafeEqual(
        signatureBuffer,
        expectedBuffer
      )
    ) {
      return null
    }

    const decoded = JSON.parse(
      Buffer.from(
        data,
        'base64url'
      ).toString('utf8')
    ) as SessionData

    if (!decoded.userId) {
      return null
    }

    return {
      userId: decoded.userId,
      isAdmin: Boolean(decoded.isAdmin),
    }

  } catch (error) {
    console.error(
      'Session verification error:',
      error
    )

    return null
  }
}

// ==========================================
// GET SESSION FROM REQUEST
// ==========================================

export function getSessionFromRequest(
  request: Request
) {
  const cookieHeader =
    request.headers.get('cookie')

  if (!cookieHeader) {
    return null
  }

  const cookies = cookieHeader
    .split(';')
    .map((cookie) => cookie.trim())

  const sessionCookie = cookies.find(
    (cookie) =>
      cookie.startsWith(
        `${COOKIE_NAME}=`
      )
  )

  if (!sessionCookie) {
    return null
  }

  const token =
    sessionCookie.substring(
      `${COOKIE_NAME}=`.length
    )

  return verifySession(token)
}

// ==========================================
// COOKIE NAME
// ==========================================

export const authCookieName =
  COOKIE_NAME