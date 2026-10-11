import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import type { RowDataPacket } from 'mysql2'
import {
  createSession,
  authCookieName,
} from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const email = body.email?.trim().toLowerCase()
    const password = body.password

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email and password are required',
        },
        { status: 400 }
      )
    }

    // ==========================================
    // FIND USER
    // ==========================================

    const [rows] = await pool.execute<RowDataPacket[]>(
      `
      SELECT
        id,
        name,
        email,
        password,
        is_admin
      FROM users
      WHERE email = ?
      LIMIT 1
      `,
      [email]
    )

    if (rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid email or password',
        },
        { status: 401 }
      )
    }

    const user = rows[0]

    // ==========================================
    // CHECK PASSWORD
    // ==========================================

    if (user.password !== password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid email or password',
        },
        { status: 401 }
      )
    }

    // ==========================================
    // CHECK ADMIN STATUS
    // ==========================================

    const isAdmin = Boolean(user.is_admin)

    // ==========================================
    // CREATE SESSION
    // ==========================================

    const sessionToken = createSession(
      user.id,
      isAdmin
    )

    // ==========================================
    // RESPONSE
    // ==========================================

    const response = NextResponse.json({
      success: true,
      message: 'Login successful',

      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: isAdmin,
      },
    })

    // ==========================================
    // SECURE COOKIE
    // ==========================================

    response.cookies.set({
      name: authCookieName,
      value: sessionToken,
      httpOnly: true,
      secure:
        process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    return response

  } catch (error) {
    console.error('Login error:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Something went wrong',
      },
      { status: 500 }
    )
  }
}