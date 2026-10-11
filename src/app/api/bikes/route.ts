import { NextResponse } from "next/server";
import pool from "@/lib/db";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

// ======================================================
// GET - Fetch Bikes
// ======================================================

// ======================================================
// GET - Fetch bikes
// ======================================================

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const pickupDate = searchParams.get("pickupDate");
    const pickupTime = searchParams.get("pickupTime");
    const returnDate = searchParams.get("returnDate");
    const returnTime = searchParams.get("returnTime");

    // ==================================================
    // NO RENTAL DATES
    // Used by Admin and normal Bikes page
    //
    // IMPORTANT:
    // Do NOT check bookings here.
    // We only return the bike's actual database status.
    // This keeps "Book Now" enabled so the customer can
    // choose a future rental date.
    // ==================================================

    if (
      !pickupDate ||
      !pickupTime ||
      !returnDate ||
      !returnTime
    ) {
      const [rows] = await pool.query<RowDataPacket[]>(`
        SELECT
          bk.id,
          bk.name,
          bk.brand,
          bk.type,
          bk.model,
          bk.price_per_day,
          bk.location,
          bk.image_url,
          bk.status,
          bk.created_at
        FROM bikes bk
        ORDER BY bk.id ASC
      `);

      return NextResponse.json(rows);
    }

    // ==================================================
    // RENTAL DATES PROVIDED
    //
    // Check whether the selected rental period overlaps
    // with an existing booking.
    // ==================================================

    const requestedStart = `${pickupDate} ${pickupTime}`;
    const requestedEnd = `${returnDate} ${returnTime}`;

    const [rows] = await pool.query<RowDataPacket[]>(
      `
      SELECT
        bk.id,
        bk.name,
        bk.brand,
        bk.type,
        bk.model,
        bk.price_per_day,
        bk.location,
        bk.image_url,
        bk.status,
        bk.created_at,

        CASE

          -- Admin manually marked bike unavailable
          WHEN LOWER(bk.status) != 'available'
            THEN 'Unavailable'

          -- Bike already booked during requested period
          WHEN EXISTS (
            SELECT 1
            FROM bookings b
            WHERE b.bike_id = bk.id
              AND LOWER(b.status) != 'cancelled'

              AND TIMESTAMP(
                b.pickup_date,
                b.pickup_time
              ) < ?

              AND TIMESTAMP(
                b.return_date,
                b.return_time
              ) > ?
          )
            THEN 'Unavailable'

          -- No overlapping booking
          ELSE 'Available'

        END AS current_status

      FROM bikes bk
      ORDER BY bk.id ASC
      `,
      [requestedEnd, requestedStart]
    );

    const bikes = rows.map((bike) => ({
      ...bike,
      status: bike.current_status,
    }));

    return NextResponse.json(bikes);

  } catch (error) {
    console.error("Fetching bikes error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch bikes",
      },
      {
        status: 500,
      }
    );
  }
}
// ======================================================
// POST - Add Bike
// ======================================================

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      brand,
      type,
      model,
      price_per_day,
      location,
      image_url,
      status,
    } = body;


    // Validation


    if (
      !name ||
      !brand ||
      !type ||
      !model ||
      !price_per_day ||
      !location ||
      !image_url
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Name, brand, type, model, price, location and image are required.",
        },
        { status: 400 }
      );
    }


    // Insert Bike


    const [result] = await pool.execute<ResultSetHeader>(
      `
      INSERT INTO bikes
      (
        name,
        brand,
        type,
        model,
        price_per_day,
        location,
        image_url,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        name,
        brand,
        type,
        model,
        Number(price_per_day),
        location,
        image_url,
        status || "Available",
      ]
    );

    return NextResponse.json(
      {
        success: true,
        message: "Bike added successfully.",
        bikeId: result.insertId,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Adding bike error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to add bike.",
      },
      { status: 500 }
    );
  }
}

// ======================================================
// PUT - Update Bike
// ======================================================

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const {
      id,
      name,
      brand,
      type,
      model,
      price_per_day,
      location,
      image_url,
      status,
    } = body;


    // Validation


    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Bike ID is required.",
        },
        { status: 400 }
      );
    }

    if (
      !name ||
      !brand ||
      !type ||
      !model ||
      !price_per_day ||
      !location ||
      !image_url
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Name, brand, type, model, price, location and image are required.",
        },
        { status: 400 }
      );
    }


    // Check Bike Exists


    const [existingRows] = await pool.execute<RowDataPacket[]>(
      `
      SELECT id
      FROM bikes
      WHERE id = ?
      `,
      [id]
    );

    if (existingRows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Bike not found.",
        },
        { status: 404 }
      );
    }


    // Update Bike


    await pool.execute(
      `
      UPDATE bikes
      SET
        name = ?,
        brand = ?,
        type = ?,
        model = ?,
        price_per_day = ?,
        location = ?,
        image_url = ?,
        status = ?
      WHERE id = ?
      `,
      [
        name,
        brand,
        type,
        model,
        Number(price_per_day),
        location,
        image_url,
        status || "Available",
        id,
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Bike updated successfully.",
    });

  } catch (error) {
    console.error("Updating bike error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update bike.",
      },
      { status: 500 }
    );
  }
}

// ======================================================
// DELETE - Delete Bike
// ======================================================

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();


    // Validate ID


    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Bike ID is required.",
        },
        { status: 400 }
      );
    }


    // Check Bike Exists


    const [existingRows] = await pool.execute<RowDataPacket[]>(
      `
      SELECT id
      FROM bikes
      WHERE id = ?
      `,
      [id]
    );

    if (existingRows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Bike not found.",
        },
        { status: 404 }
      );
    }


    // Check Bookings


    const [bookingRows] = await pool.execute<RowDataPacket[]>(
      `
      SELECT id
      FROM bookings
      WHERE bike_id = ?
      LIMIT 1
      `,
      [id]
    );

    if (bookingRows.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This bike cannot be deleted because it has booking records.",
        },
        { status: 409 }
      );
    }


    // Delete Bike


    await pool.execute(
      `
      DELETE FROM bikes
      WHERE id = ?
      `,
      [id]
    );

    return NextResponse.json({
      success: true,
      message: "Bike deleted successfully.",
    });

  } catch (error) {
    console.error("Deleting bike error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete bike.",
      },
      { status: 500 }
    );
  }
}