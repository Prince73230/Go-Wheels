import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";
import type { RowDataPacket } from "mysql2";

// ======================================================
// GET - Fetch All Users
// ======================================================

export async function GET(request: Request) {
  try {
    // ==================================================
    // ADMIN AUTHENTICATION
    // ==================================================

    const session = getSessionFromRequest(request);

    console.log("Users API session:", session);

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required.",
        },
        { status: 401 }
      );
    }

    if (!session.isAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin access required.",
        },
        { status: 403 }
      );
    }

    // ==================================================
    // FETCH USERS
    // ==================================================

    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT
        u.id,
        u.name,
        u.email,
        u.phone,
        u.location,
        u.created_at,

        COUNT(
          CASE
            WHEN b.id IS NOT NULL
            AND LOWER(COALESCE(b.status, '')) != 'cancelled'
            THEN b.id
          END
        ) AS booking_count,

        COALESCE(
          SUM(
            CASE
              WHEN b.id IS NOT NULL
              AND LOWER(COALESCE(b.status, '')) != 'cancelled'
              THEN COALESCE(b.total_amount, 0)
              ELSE 0
            END
          ),
          0
        ) AS total_spent

      FROM users u

      LEFT JOIN bookings b
        ON b.user_id = u.id

      GROUP BY
        u.id,
        u.name,
        u.email,
        u.phone,
        u.location,
        u.created_at

      ORDER BY u.id DESC
    `);

    // ==================================================
    // FORMAT USERS
    // ==================================================

    const users = rows.map((user) => ({
      id: Number(user.id),

      name: user.name || "",

      email: user.email || "",

      phone: user.phone || "",

      location: user.location || "",

      created_at: user.created_at,

      booking_count: Number(
        user.booking_count || 0
      ),

      total_spent: Number(
        user.total_spent || 0
      ),
    }));

    console.log(
      "Users fetched successfully:",
      users
    );

    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error(
      "Admin users GET error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          (error instanceof Error ? error.message : undefined) ||
          "Failed to fetch users.",
      },
      { status: 500 }
    );
  }
}

// ======================================================
// PUT - Update User
// ======================================================

export async function PUT(request: Request) {
  try {
    // ==================================================
    // ADMIN AUTHENTICATION
    // ==================================================

    const session = getSessionFromRequest(request);

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required.",
        },
        { status: 401 }
      );
    }

    if (!session.isAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin access required.",
        },
        { status: 403 }
      );
    }

    // ==================================================
    // REQUEST DATA
    // ==================================================

    const body = await request.json();

    const id = Number(body.id);

    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const phone = body.phone?.trim();
    const location = body.location?.trim();

    // ==================================================
    // VALIDATION
    // ==================================================

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required.",
        },
        { status: 400 }
      );
    }

    if (
      !name ||
      !email ||
      !phone ||
      !location
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Name, email, phone and location are required.",
        },
        { status: 400 }
      );
    }

    // ==================================================
    // CHECK USER EXISTS
    // ==================================================

    const [existingRows] =
      await pool.execute<RowDataPacket[]>(
        `
        SELECT id
        FROM users
        WHERE id = ?
        LIMIT 1
        `,
        [id]
      );

    if (existingRows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 }
      );
    }

    // ==================================================
    // CHECK EMAIL
    // ==================================================

    const [emailRows] =
      await pool.execute<RowDataPacket[]>(
        `
        SELECT id
        FROM users
        WHERE email = ?
        AND id != ?
        LIMIT 1
        `,
        [email, id]
      );

    if (emailRows.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Another account already uses this email.",
        },
        { status: 409 }
      );
    }

    // ==================================================
    // UPDATE USER
    // ==================================================

    await pool.execute(
      `
      UPDATE users
      SET
        name = ?,
        email = ?,
        phone = ?,
        location = ?
      WHERE id = ?
      `,
      [
        name,
        email,
        phone,
        location,
        id,
      ]
    );

    return NextResponse.json({
      success: true,
      message: "User updated successfully.",
    });
  } catch (error) {
    console.error(
      "Admin users PUT error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          (error instanceof Error ? error.message : undefined) ||
          "Failed to update user.",
      },
      { status: 500 }
    );
  }
}

// ======================================================
// DELETE - Delete User
// ======================================================

export async function DELETE(request: Request) {
  try {
    // ==================================================
    // ADMIN AUTHENTICATION
    // ==================================================

    const session = getSessionFromRequest(request);

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required.",
        },
        { status: 401 }
      );
    }

    if (!session.isAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin access required.",
        },
        { status: 403 }
      );
    }

    // ==================================================
    // REQUEST DATA
    // ==================================================

    const body = await request.json();

    const id = Number(body.id);

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required.",
        },
        { status: 400 }
      );
    }

    // ==================================================
    // CHECK USER EXISTS
    // ==================================================

    const [existingRows] =
      await pool.execute<RowDataPacket[]>(
        `
        SELECT id
        FROM users
        WHERE id = ?
        LIMIT 1
        `,
        [id]
      );

    if (existingRows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 }
      );
    }

    // ==================================================
    // CHECK BOOKINGS
    // ==================================================

    const [bookingRows] =
      await pool.execute<RowDataPacket[]>(
        `
        SELECT id
        FROM bookings
        WHERE user_id = ?
        LIMIT 1
        `,
        [id]
      );

    if (bookingRows.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This user cannot be deleted because they have booking records.",
        },
        { status: 409 }
      );
    }

    // ==================================================
    // DELETE USER
    // ==================================================

    await pool.execute(
      `
      DELETE FROM users
      WHERE id = ?
      `,
      [id]
    );

    return NextResponse.json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Admin users DELETE error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          (error instanceof Error ? error.message : undefined) ||
          "Failed to delete user.",
      },
      { status: 500 }
    );
  }
}