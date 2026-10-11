import { NextResponse } from "next/server";
import pool from "@/lib/db";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

// ======================================================
// GET - Fetch Vehicles
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
    // ==================================================

    if (
      !pickupDate ||
      !pickupTime ||
      !returnDate ||
      !returnTime
    ) {
      const [rows] = await pool.query<RowDataPacket[]>(`
        SELECT
          id,
          name,
          brand,
          type,
          model,
          price_per_day,
          location,
          image_url,
          status,
          created_at
        FROM vehicles
        ORDER BY id ASC
      `);

      return NextResponse.json(rows);
    }

    // ==================================================
    // RENTAL DATES PROVIDED
    // ==================================================

    const requestedStart =
      `${pickupDate} ${pickupTime}`;

    const requestedEnd =
      `${returnDate} ${returnTime}`;

    const [rows] = await pool.query<RowDataPacket[]>(
      `
      SELECT
        v.id,
        v.name,
        v.brand,
        v.type,
        v.model,
        v.price_per_day,
        v.location,
        v.image_url,
        v.status,
        v.created_at,

        CASE

          WHEN LOWER(TRIM(v.status)) != 'available'
            THEN 'Unavailable'

          WHEN EXISTS (
            SELECT 1
            FROM bookings b
            WHERE b.vehicle_id = v.id

              AND LOWER(
                COALESCE(b.status, 'pending')
              ) != 'cancelled'

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

          ELSE 'Available'

        END AS current_status

      FROM vehicles v
      ORDER BY v.id ASC
      `,
      [
        requestedEnd,
        requestedStart,
      ]
    );

    const vehicles = rows.map(
      (vehicle) => ({
        id: vehicle.id,
        name: vehicle.name,
        brand: vehicle.brand,
        type: vehicle.type,
        model: vehicle.model,
        price_per_day:
          vehicle.price_per_day,
        location: vehicle.location,
        image_url: vehicle.image_url,

        status:
          vehicle.current_status,

        created_at:
          vehicle.created_at,
      })
    );

    return NextResponse.json(vehicles);
  } catch (error) {
    console.error(
      "Fetching vehicles error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch vehicles.",
      },
      { status: 500 }
    );
  }
}

// ======================================================
// POST - Add Vehicle
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

    if (
      !name ||
      !brand ||
      !type ||
      !model ||
      price_per_day === undefined ||
      price_per_day === null ||
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

    const [result] =
      await pool.execute<ResultSetHeader>(
        `
        INSERT INTO vehicles
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
        message:
          "Vehicle added successfully.",
        vehicleId:
          result.insertId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Adding vehicle error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to add vehicle.",
      },
      { status: 500 }
    );
  }
}

// ======================================================
// PUT - Update Vehicle
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

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Vehicle ID is required.",
        },
        { status: 400 }
      );
    }

    if (
      !name ||
      !brand ||
      !type ||
      !model ||
      price_per_day === undefined ||
      price_per_day === null ||
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

    const [existingRows] =
      await pool.execute<RowDataPacket[]>(
        `
        SELECT id
        FROM vehicles
        WHERE id = ?
        LIMIT 1
        `,
        [id]
      );

    if (existingRows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Vehicle not found.",
        },
        { status: 404 }
      );
    }

    await pool.execute(
      `
      UPDATE vehicles
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
      message:
        "Vehicle updated successfully.",
    });
  } catch (error) {
    console.error(
      "Updating vehicle error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to update vehicle.",
      },
      { status: 500 }
    );
  }
}

// ======================================================
// DELETE - Delete Vehicle
// ======================================================

export async function DELETE(request: Request) {
  try {
    const body = await request.json();

    const id = Number(body.id);

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Vehicle ID is required.",
        },
        { status: 400 }
      );
    }

    const [existingRows] =
      await pool.execute<RowDataPacket[]>(
        `
        SELECT id
        FROM vehicles
        WHERE id = ?
        LIMIT 1
        `,
        [id]
      );

    if (existingRows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Vehicle not found.",
        },
        { status: 404 }
      );
    }

    const [bookingRows] =
      await pool.execute<RowDataPacket[]>(
        `
        SELECT id
        FROM bookings
        WHERE vehicle_id = ?
        LIMIT 1
        `,
        [id]
      );

    if (bookingRows.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This vehicle cannot be deleted because it has booking records.",
        },
        { status: 409 }
      );
    }

    await pool.execute(
      `
      DELETE FROM vehicles
      WHERE id = ?
      `,
      [id]
    );

    return NextResponse.json({
      success: true,
      message:
        "Vehicle deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Deleting vehicle error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to delete vehicle.",
      },
      { status: 500 }
    );
  }
}