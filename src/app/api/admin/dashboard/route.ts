import { NextResponse } from "next/server";
import pool from "@/lib/db";
import type { RowDataPacket } from "mysql2";

export async function GET() {
  try {
    // ==========================================
    // TOTAL USERS
    // ==========================================

    const [usersResult] = await pool.query<RowDataPacket[]>(`
      SELECT COUNT(*) AS total
      FROM users
    `);

    // ==========================================
    // TOTAL CARS
    // ==========================================

    const [carsResult] = await pool.query<RowDataPacket[]>(`
      SELECT COUNT(*) AS total
      FROM vehicles
    `);

    // ==========================================
    // TOTAL BIKES
    // ==========================================

    const [bikesResult] = await pool.query<RowDataPacket[]>(`
      SELECT COUNT(*) AS total
      FROM bikes
    `);

    // ==========================================
    // TOTAL BOOKINGS
    // ==========================================

    const [bookingsResult] = await pool.query<RowDataPacket[]>(`
      SELECT COUNT(*) AS total
      FROM bookings
    `);

    // ==========================================
    // PENDING BOOKINGS
    // ==========================================

    const [pendingResult] = await pool.query<RowDataPacket[]>(`
      SELECT COUNT(*) AS total
      FROM bookings
      WHERE LOWER(status) = 'pending'
    `);

    // ==========================================
    // COMPLETED BOOKINGS
    // ==========================================

    const [completedResult] = await pool.query<RowDataPacket[]>(`
      SELECT COUNT(*) AS total
      FROM bookings
      WHERE LOWER(status) = 'completed'
    `);

    // ==========================================
    // CANCELLED BOOKINGS
    // ==========================================

    const [cancelledResult] = await pool.query<RowDataPacket[]>(`
      SELECT COUNT(*) AS total
      FROM bookings
      WHERE LOWER(status) = 'cancelled'
    `);

    // ==========================================
    // TOTAL REVENUE
    // Cancelled bookings are excluded
    // ==========================================

    const [revenueResult] = await pool.query<RowDataPacket[]>(`
      SELECT COALESCE(SUM(total_amount), 0) AS total
      FROM bookings
      WHERE LOWER(status) != 'cancelled'
    `);

    // ==========================================
    // RECENT BOOKINGS
    // ==========================================

    const [recentBookings] = await pool.query<RowDataPacket[]>(`
      SELECT
        b.id,
        b.user_id,
        b.vehicle_id,
        b.bike_id,

        b.pickup_date,
        b.pickup_time,

        b.return_date,
        b.return_time,

        b.total_amount,
        b.status,
        b.created_at,

        -- USER INFORMATION
        u.name AS user_name,
        u.email AS user_email,

        -- VEHICLE / BIKE NAME
        COALESCE(v.name, bk.name) AS vehicle_name

      FROM bookings b

      -- USER
      LEFT JOIN users u
        ON b.user_id = u.id

      -- CAR
      LEFT JOIN vehicles v
        ON b.vehicle_id = v.id

      -- BIKE
      LEFT JOIN bikes bk
        ON b.bike_id = bk.id

      ORDER BY b.created_at DESC

      LIMIT 5
    `);

    // ==========================================
    // FORMAT STATISTICS
    // ==========================================

    const statistics = {
      users: Number(usersResult[0]?.total || 0),

      cars: Number(carsResult[0]?.total || 0),

      bikes: Number(bikesResult[0]?.total || 0),

      bookings: Number(bookingsResult[0]?.total || 0),

      pending: Number(pendingResult[0]?.total || 0),

      completed: Number(completedResult[0]?.total || 0),

      cancelled: Number(cancelledResult[0]?.total || 0),

      revenue: Number(revenueResult[0]?.total || 0),
    };

    // ==========================================
    // SEND RESPONSE
    // ==========================================

    return NextResponse.json({
      success: true,

      statistics,

      recentBookings,
    });

  } catch (error) {

    // ==========================================
    // ERROR LOG
    // ==========================================

    console.error(
      "Admin dashboard API error:",
      error
    );

    // ==========================================
    // ERROR RESPONSE
    // ==========================================

    return NextResponse.json(
      {
        success: false,

        message:
          "Failed to load admin dashboard data.",

        statistics: {
          users: 0,
          cars: 0,
          bikes: 0,
          bookings: 0,
          pending: 0,
          completed: 0,
          cancelled: 0,
          revenue: 0,
        },

        recentBookings: [],
      },
      {
        status: 500,
      }
    );
  }
}