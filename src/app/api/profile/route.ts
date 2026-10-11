import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'
import { getSessionFromRequest } from '@/lib/auth'
import type { RowDataPacket } from 'mysql2'

// ======================================================
// GET PROFILE
// ======================================================

export async function GET(request: NextRequest) {
  try {
    const session = getSessionFromRequest(request)

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: 'You must be logged in.',
        },
        { status: 401 }
      )
    }

    const userId = session.userId

    const [rows] = await db.execute<RowDataPacket[]>(
      `
      SELECT
        id,
        name,
        email,
        phone,
        location,
        created_at
      FROM users
      WHERE id = ?
      LIMIT 1
      `,
      [userId]
    )

    if (rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'User not found.',
        },
        { status: 404 }
      )
    }

    const user = rows[0]

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        location: user.location || '',
        created_at: user.created_at,
      },
    })
  } catch (error) {
    console.error('Profile GET error:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch profile.',
      },
      { status: 500 }
    )
  }
}

// ======================================================
// UPDATE PROFILE
// ======================================================

export async function PATCH(request: NextRequest) {
  try {
    const session = getSessionFromRequest(request)

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: 'You must be logged in.',
        },
        { status: 401 }
      )
    }

    const userId = session.userId

    const body = await request.json()

    const name = String(body.name || '').trim()
    const phone = String(body.phone || '').trim()
    const location = String(body.location || '').trim()

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: 'Name is required.',
        },
        { status: 400 }
      )
    }

    await db.execute(
      `
      UPDATE users
      SET
        name = ?,
        phone = ?,
        location = ?
      WHERE id = ?
      `,
      [name, phone, location, userId]
    )

    const [rows] = await db.execute<RowDataPacket[]>(
      `
      SELECT
        id,
        name,
        email,
        phone,
        location,
        created_at
      FROM users
      WHERE id = ?
      LIMIT 1
      `,
      [userId]
    )

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully.',
      user: rows[0],
    })
  } catch (error) {
    console.error('Profile UPDATE error:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update profile.',
      },
      { status: 500 }
    )
  }
}