import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import type { ResultSetHeader, RowDataPacket } from 'mysql2'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const {
      name,
      email,
      phone,
      location,
      password,
    } = body

    // ======================================================
    // VALIDATION
    // ======================================================

    if (
      !name ||
      !email ||
      !phone ||
      !location ||
      !password
    ) {
      return NextResponse.json(
        {
          success: false,
          message: 'All fields are required.',
        },
        {
          status: 400,
        }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Password must be at least 8 characters long.',
        },
        {
          status: 400,
        }
      )
    }

    // ======================================================
    // CHECK IF EMAIL ALREADY EXISTS
    // ======================================================

    const [existingRows] = await pool.execute<RowDataPacket[]>(
      `
      SELECT id
      FROM users
      WHERE email = ?
      LIMIT 1
      `,
      [email]
    )

    if (existingRows.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            'An account with this email already exists.',
        },
        {
          status: 409,
        }
      )
    }

    // ======================================================
    // CREATE USER
    // ======================================================

    const [result] = await pool.execute<ResultSetHeader>(
      `
      INSERT INTO users
      (
        name,
        email,
        phone,
        location,
        password
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        name.trim(),
        email.trim().toLowerCase(),
        phone.trim(),
        location.trim(),
        password,
      ]
    )

    // ======================================================
    // GET CREATED USER
    // ======================================================

    const [rows] = await pool.execute<RowDataPacket[]>(
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
      [result.insertId]
    )

    if (rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Account was created but user information could not be loaded.',
        },
        {
          status: 500,
        }
      )
    }

    const user = rows[0]

    // ======================================================
    // RESPONSE
    // ======================================================

    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully.',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          location: user.location,
          created_at: user.created_at,
        },
      },
      {
        status: 201,
      }
    )

  } catch (error) {
    console.error('Signup error:', error)

    // Duplicate email safety check
    if (
      error instanceof Error &&
      'code' in error &&
      error.code === 'ER_DUP_ENTRY'
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            'An account with this email already exists.',
        },
        {
          status: 409,
        }
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Something went wrong while creating your account.',
      },
      {
        status: 500,
      }
    )
  }
}