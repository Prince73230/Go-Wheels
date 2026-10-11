import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

// ======================================================
// GET - Fetch bookings
//
// USER  -> only their own bookings
// ADMIN -> all bookings
// ======================================================

export async function GET(request: Request) {
  try {
    const session = getSessionFromRequest(request);

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login before viewing bookings.",
        },
        { status: 401 }
      );
    }

    const userId = session.userId;

    if (!userId || Number.isNaN(userId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Unable to identify logged-in user.",
        },
        { status: 401 }
      );
    }

    // ==================================================
    // ADMIN -> ALL BOOKINGS
    // USER  -> OWN BOOKINGS
    // ==================================================

    let rows: RowDataPacket[];

    if (session.isAdmin) {
      const [result] = await pool.query<RowDataPacket[]>(`
        SELECT

          b.id,

          b.user_id,
          u.name AS user_name,
          u.email AS user_email,

          b.vehicle_id,

          v.name AS vehicle_name,
          v.brand AS vehicle_brand,
          v.type AS vehicle_type,
          v.model AS vehicle_model,
          v.location AS vehicle_location,
          v.image_url AS vehicle_image,

          b.bike_id,

          bk.name AS bike_name,
          bk.brand AS bike_brand,
          bk.type AS bike_type,
          bk.model AS bike_model,
          bk.location AS bike_location,
          bk.image_url AS bike_image,

          b.pickup_date,
          b.pickup_time,

          b.return_date,
          b.return_time,

          b.total_amount,
          b.status,
          b.created_at

        FROM bookings b

        LEFT JOIN users u
          ON b.user_id = u.id

        LEFT JOIN vehicles v
          ON b.vehicle_id = v.id

        LEFT JOIN bikes bk
          ON b.bike_id = bk.id

        ORDER BY b.created_at DESC
      `);

      rows = result;
    } else {
      const [result] = await pool.execute<RowDataPacket[]>(
        `
        SELECT

          b.id,

          b.user_id,
          u.name AS user_name,
          u.email AS user_email,

          b.vehicle_id,

          v.name AS vehicle_name,
          v.brand AS vehicle_brand,
          v.type AS vehicle_type,
          v.model AS vehicle_model,
          v.location AS vehicle_location,
          v.image_url AS vehicle_image,

          b.bike_id,

          bk.name AS bike_name,
          bk.brand AS bike_brand,
          bk.type AS bike_type,
          bk.model AS bike_model,
          bk.location AS bike_location,
          bk.image_url AS bike_image,

          b.pickup_date,
          b.pickup_time,

          b.return_date,
          b.return_time,

          b.total_amount,
          b.status,
          b.created_at

        FROM bookings b

        LEFT JOIN users u
          ON b.user_id = u.id

        LEFT JOIN vehicles v
          ON b.vehicle_id = v.id

        LEFT JOIN bikes bk
          ON b.bike_id = bk.id

        WHERE b.user_id = ?

        ORDER BY b.created_at DESC
        `,
        [userId]
      );

      rows = result;
    }

    // ==================================================
    // FORMAT BOOKINGS
    // ==================================================

    const bookings = rows.map((booking) => {
      const isBike = booking.bike_id !== null;

      return {
        id: booking.id,

        user_id: booking.user_id,

        user_name:
          booking.user_name || "Unknown User",

        user_email:
          booking.user_email || "No email",

        vehicle_id:
          booking.vehicle_id,

        bike_id:
          booking.bike_id,

        // ==============================================
        // COMMON VEHICLE DATA
        // This matches your frontend Booking type
        // ==============================================

        name: isBike
          ? booking.bike_name
          : booking.vehicle_name,

        brand: isBike
          ? booking.bike_brand
          : booking.vehicle_brand,

        type: isBike
          ? booking.bike_type || "Bike"
          : booking.vehicle_type || "Car",

        model: isBike
          ? booking.bike_model
          : booking.vehicle_model,

        location: isBike
          ? booking.bike_location
          : booking.vehicle_location,

        image_url: isBike
          ? booking.bike_image
          : booking.vehicle_image,

        // ==============================================
        // ORIGINAL DISPLAY FIELDS
        // Useful for admin
        // ==============================================

        vehicle_name:
          booking.vehicle_name,

        vehicle_brand:
          booking.vehicle_brand,

        bike_name:
          booking.bike_name,

        bike_brand:
          booking.bike_brand,

        type_display: isBike
          ? "Bike"
          : "Car",

        vehicle_name_display: isBike
          ? booking.bike_name
          : booking.vehicle_name,

        vehicle_brand_display: isBike
          ? booking.bike_brand
          : booking.vehicle_brand,

        // ==============================================
        // BOOKING DETAILS
        // ==============================================

        pickup_date:
          booking.pickup_date,

        pickup_time:
          booking.pickup_time,

        return_date:
          booking.return_date,

        return_time:
          booking.return_time,

        total_amount:
          Number(booking.total_amount),

        status:
          booking.status || "Pending",

        created_at:
          booking.created_at,
      };
    });

    return NextResponse.json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error(
      "Bookings GET error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch bookings.",
      },
      { status: 500 }
    );
  }
}

// ======================================================
// POST - Create Booking
// USER
// ======================================================

export async function POST(request: Request) {
  try {
    // ==================================================
    // GET LOGGED-IN USER
    // ==================================================

    const session =
      getSessionFromRequest(request);

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please login before booking.",
        },
        { status: 401 }
      );
    }

    const userId = session.userId;

    if (
      !userId ||
      Number.isNaN(userId)
    ) {
      console.error(
        "Invalid session:",
        session
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Unable to identify logged-in user.",
        },
        { status: 401 }
      );
    }

    // ==================================================
    // REQUEST BODY
    // ==================================================

    const body =
      await request.json();

    const vehicleId =
      body.vehicleId !== undefined
        ? body.vehicleId
        : body.vehicle_id;

    const bikeId =
      body.bikeId !== undefined
        ? body.bikeId
        : body.bike_id;

    const pickupDate =
      body.pickupDate !== undefined
        ? body.pickupDate
        : body.pickup_date;

    const pickupTime =
      body.pickupTime !== undefined
        ? body.pickupTime
        : body.pickup_time;

    const returnDate =
      body.returnDate !== undefined
        ? body.returnDate
        : body.return_date;

    const returnTime =
      body.returnTime !== undefined
        ? body.returnTime
        : body.return_time;

    const totalAmount =
      body.totalAmount !== undefined
        ? body.totalAmount
        : body.total_amount;

    // ==================================================
    // NORMALIZE IDS
    // ==================================================

    const normalizedVehicleId =
      vehicleId !== null &&
        vehicleId !== undefined &&
        vehicleId !== ""
        ? Number(vehicleId)
        : null;

    const normalizedBikeId =
      bikeId !== null &&
        bikeId !== undefined &&
        bikeId !== ""
        ? Number(bikeId)
        : null;

    // ==================================================
    // VALIDATE VEHICLE / BIKE
    // ==================================================

    if (
      normalizedVehicleId === null &&
      normalizedBikeId === null
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Vehicle or bike is required.",
        },
        { status: 400 }
      );
    }

    if (
      normalizedVehicleId !== null &&
      normalizedBikeId !== null
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A booking cannot contain both a car and a bike.",
        },
        { status: 400 }
      );
    }

    // ==================================================
    // VALIDATE DATES
    // ==================================================

    if (
      !pickupDate ||
      !pickupTime ||
      !returnDate ||
      !returnTime
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Pickup and return date/time are required.",
        },
        { status: 400 }
      );
    }

    const pickupDateTime =
      new Date(
        `${pickupDate}T${pickupTime}`
      );

    const returnDateTime =
      new Date(
        `${returnDate}T${returnTime}`
      );

    if (
      Number.isNaN(
        pickupDateTime.getTime()
      ) ||
      Number.isNaN(
        returnDateTime.getTime()
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid pickup or return date/time.",
        },
        { status: 400 }
      );
    }

    if (
      returnDateTime <=
      pickupDateTime
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Return date/time must be after pickup date/time.",
        },
        { status: 400 }
      );
    }

    // ==================================================
    // VALIDATE TOTAL
    // ==================================================

    const amount =
      Number(totalAmount);

    if (
      totalAmount === undefined ||
      totalAmount === null ||
      Number.isNaN(amount) ||
      amount <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid total amount.",
        },
        { status: 400 }
      );
    }

    // ==================================================
    // CHECK USER
    // ==================================================

    const [userRows] =
      await pool.execute<RowDataPacket[]>(
        `
        SELECT id
        FROM users
        WHERE id = ?
        LIMIT 1
        `,
        [userId]
      );

    if (
      userRows.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "User account not found.",
        },
        { status: 404 }
      );
    }

    // ==================================================
    // CHECK CAR
    // ==================================================

    if (
      normalizedVehicleId !== null
    ) {
      const [vehicleRows] =
        await pool.execute<RowDataPacket[]>(
          `
          SELECT id, status
          FROM vehicles
          WHERE id = ?
          LIMIT 1
          `,
          [normalizedVehicleId]
        );

      if (
        vehicleRows.length === 0
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Vehicle not found.",
          },
          { status: 404 }
        );
      }

      if (
        String(
          vehicleRows[0].status
        ).toLowerCase() !==
        "available"
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "This vehicle is currently unavailable.",
          },
          { status: 409 }
        );
      }

      // ==============================================
      // CHECK CAR OVERLAP
      // ==============================================

      const [overlapRows] =
        await pool.execute<RowDataPacket[]>(
          `
          SELECT id
          FROM bookings
          WHERE vehicle_id = ?

            AND LOWER(
              COALESCE(status, 'pending')
            ) != 'cancelled'

            AND TIMESTAMP(
              pickup_date,
              pickup_time
            ) < ?

            AND TIMESTAMP(
              return_date,
              return_time
            ) > ?

          LIMIT 1
          `,
          [
            normalizedVehicleId,
            `${returnDate} ${returnTime}`,
            `${pickupDate} ${pickupTime}`,
          ]
        );

      if (
        overlapRows.length > 0
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "This vehicle is already booked for the selected dates and time.",
          },
          { status: 409 }
        );
      }
    }

    // ==================================================
    // CHECK BIKE
    // ==================================================

    if (
      normalizedBikeId !== null
    ) {
      const [bikeRows] =
        await pool.execute<RowDataPacket[]>(
          `
          SELECT id, status
          FROM bikes
          WHERE id = ?
          LIMIT 1
          `,
          [normalizedBikeId]
        );

      if (
        bikeRows.length === 0
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Bike not found.",
          },
          { status: 404 }
        );
      }

      if (
        String(
          bikeRows[0].status
        ).toLowerCase() !==
        "available"
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "This bike is currently unavailable.",
          },
          { status: 409 }
        );
      }

      // ==============================================
      // CHECK BIKE OVERLAP
      // ==============================================

      const [overlapRows] =
        await pool.execute<RowDataPacket[]>(
          `
          SELECT id
          FROM bookings
          WHERE bike_id = ?

            AND LOWER(
              COALESCE(status, 'pending')
            ) != 'cancelled'

            AND TIMESTAMP(
              pickup_date,
              pickup_time
            ) < ?

            AND TIMESTAMP(
              return_date,
              return_time
            ) > ?

          LIMIT 1
          `,
          [
            normalizedBikeId,
            `${returnDate} ${returnTime}`,
            `${pickupDate} ${pickupTime}`,
          ]
        );

      if (
        overlapRows.length > 0
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "This bike is already booked for the selected dates and time.",
          },
          { status: 409 }
        );
      }
    }

    // ==================================================
    // CREATE BOOKING
    // ==================================================

    const [result] =
      await pool.execute<ResultSetHeader>(
        `
        INSERT INTO bookings
        (
          user_id,
          vehicle_id,
          bike_id,
          pickup_date,
          pickup_time,
          return_date,
          return_time,
          total_amount,
          status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          userId,
          normalizedVehicleId,
          normalizedBikeId,
          pickupDate,
          pickupTime,
          returnDate,
          returnTime,
          amount,
          "Pending",
        ]
      );

    return NextResponse.json(
      {
        success: true,
        message:
          "Booking created successfully.",
        bookingId:
          result.insertId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Create booking error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to create booking.",
      },
      { status: 500 }
    );
  }
}

// ======================================================
// PATCH - Cancel user's own booking
// USER
// ======================================================

export async function PATCH(
  request: Request
) {
  try {
    const session =
      getSessionFromRequest(request);

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please login before cancelling a booking.",
        },
        { status: 401 }
      );
    }

    const userId = session.userId;

    if (
      !userId ||
      Number.isNaN(userId)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Unable to identify logged-in user.",
        },
        { status: 401 }
      );
    }

    const body =
      await request.json();

    const bookingId = Number(
      body.booking_id ??
      body.bookingId ??
      body.id
    );

    if (
      !bookingId ||
      Number.isNaN(bookingId)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Booking ID is required.",
        },
        { status: 400 }
      );
    }

    // ==================================================
    // CHECK USER'S BOOKING
    // ==================================================

    const [bookingRows] =
      await pool.execute<RowDataPacket[]>(
        `
        SELECT id, status
        FROM bookings
        WHERE id = ?
          AND user_id = ?
        LIMIT 1
        `,
        [
          bookingId,
          userId,
        ]
      );

    if (
      bookingRows.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Booking not found.",
        },
        { status: 404 }
      );
    }

    const currentStatus =
      String(
        bookingRows[0].status || ""
      ).toLowerCase();

    if (
      currentStatus ===
      "cancelled"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Booking is already cancelled.",
        },
        { status: 409 }
      );
    }

    if (
      currentStatus ===
      "completed"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Completed bookings cannot be cancelled.",
        },
        { status: 409 }
      );
    }

    // ==================================================
    // CANCEL BOOKING
    // ==================================================

    await pool.execute(
      `
      UPDATE bookings
      SET status = 'Cancelled'
      WHERE id = ?
        AND user_id = ?
      `,
      [
        bookingId,
        userId,
      ]
    );

    return NextResponse.json({
      success: true,
      message:
        "Booking cancelled successfully.",
    });
  } catch (error) {
    console.error(
      "Cancel booking error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to cancel booking.",
      },
      { status: 500 }
    );
  }
}

// ======================================================
// PUT - Update booking status
// ADMIN ONLY
// ======================================================

export async function PUT(
  request: Request
) {
  try {
    const session =
      getSessionFromRequest(request);

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Authentication required.",
        },
        { status: 401 }
      );
    }

    if (!session.isAdmin) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Admin access required.",
        },
        { status: 403 }
      );
    }

    const body =
      await request.json();

    const id = Number(
      body.id
    );

    const status =
      body.status;

    if (
      !id ||
      !status
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Booking ID and status are required.",
        },
        { status: 400 }
      );
    }

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Completed",
      "Cancelled",
    ];

    if (
      !allowedStatuses.includes(
        status
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid booking status.",
        },
        { status: 400 }
      );
    }

    const [existingRows] =
      await pool.execute<RowDataPacket[]>(
        `
        SELECT id
        FROM bookings
        WHERE id = ?
        LIMIT 1
        `,
        [id]
      );

    if (
      existingRows.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Booking not found.",
        },
        { status: 404 }
      );
    }

    await pool.execute(
      `
      UPDATE bookings
      SET status = ?
      WHERE id = ?
      `,
      [
        status,
        id,
      ]
    );

    return NextResponse.json({
      success: true,
      message:
        "Booking status updated successfully.",
    });
  } catch (error) {
    console.error(
      "Admin bookings PUT error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to update booking.",
      },
      { status: 500 }
    );
  }
}