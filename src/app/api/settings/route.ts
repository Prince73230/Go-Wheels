import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";
import type { RowDataPacket } from "mysql2";

// ======================================================
// SETTINGS TABLE
// ======================================================

async function createSettingsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS settings (
      id INT PRIMARY KEY,
      app_name VARCHAR(255) NOT NULL DEFAULT 'GoWheels',
      support_email VARCHAR(255) NOT NULL DEFAULT 'support@gowheels.com',
      support_phone VARCHAR(50) NOT NULL DEFAULT '+91 98765 43210',
      location VARCHAR(255) NOT NULL DEFAULT 'Dehradun, Uttarakhand',
      currency VARCHAR(10) NOT NULL DEFAULT 'INR',

      min_rental INT NOT NULL DEFAULT 1,
      max_rental INT NOT NULL DEFAULT 30,
      advance_booking INT NOT NULL DEFAULT 60,
      late_fee DECIMAL(10,2) NOT NULL DEFAULT 200,

      same_day_booking BOOLEAN NOT NULL DEFAULT TRUE,
      auto_availability BOOLEAN NOT NULL DEFAULT TRUE,

      auto_confirm BOOLEAN NOT NULL DEFAULT TRUE,
      admin_approval BOOLEAN NOT NULL DEFAULT FALSE,
      allow_cancellation BOOLEAN NOT NULL DEFAULT TRUE,
      allow_modification BOOLEAN NOT NULL DEFAULT TRUE,

      tax DECIMAL(5,2) NOT NULL DEFAULT 18,
      deposit DECIMAL(10,2) NOT NULL DEFAULT 1000,
      online_payment BOOLEAN NOT NULL DEFAULT TRUE,
      cash_payment BOOLEAN NOT NULL DEFAULT TRUE,

      new_booking BOOLEAN NOT NULL DEFAULT TRUE,
      booking_cancellation BOOLEAN NOT NULL DEFAULT TRUE,
      new_user BOOLEAN NOT NULL DEFAULT TRUE,
      vehicle_added BOOLEAN NOT NULL DEFAULT FALSE,
      admin_alerts BOOLEAN NOT NULL DEFAULT TRUE,

      two_factor BOOLEAN NOT NULL DEFAULT FALSE,
      login_alerts BOOLEAN NOT NULL DEFAULT TRUE,

      maintenance_mode BOOLEAN NOT NULL DEFAULT FALSE,

      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  // Create default settings row
  await pool.query(`
    INSERT IGNORE INTO settings (id)
    VALUES (1)
  `);
}

// ======================================================
// ADMIN AUTH
// ======================================================

function checkAdmin(request: Request) {
  const session = getSessionFromRequest(request);

  if (!session) {
    return {
      success: false,
      response: NextResponse.json(
        {
          success: false,
          message: "Authentication required.",
        },
        { status: 401 }
      ),
    };
  }

  if (!session.isAdmin) {
    return {
      success: false,
      response: NextResponse.json(
        {
          success: false,
          message: "Admin access required.",
        },
        { status: 403 }
      ),
    };
  }

  return {
    success: true,
    session,
  };
}

// ======================================================
// GET - FETCH SETTINGS
// ======================================================

export async function GET(request: Request) {
  try {
    const auth = checkAdmin(request);

    if (!auth.success) {
      return auth.response;
    }

    await createSettingsTable();

    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT
        id,

        app_name,
        support_email,
        support_phone,
        location,
        currency,

        min_rental,
        max_rental,
        advance_booking,
        late_fee,

        same_day_booking,
        auto_availability,

        auto_confirm,
        admin_approval,
        allow_cancellation,
        allow_modification,

        tax,
        deposit,
        online_payment,
        cash_payment,

        new_booking,
        booking_cancellation,
        new_user,
        vehicle_added,
        admin_alerts,

        two_factor,
        login_alerts,

        maintenance_mode,

        updated_at

      FROM settings
      WHERE id = 1
      LIMIT 1
    `);

    if (rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Settings not found.",
        },
        { status: 404 }
      );
    }

    const settings = rows[0];

    return NextResponse.json({
      success: true,
      settings: {
        id: settings.id,

        appName: settings.app_name,
        supportEmail: settings.support_email,
        supportPhone: settings.support_phone,
        location: settings.location,
        currency: settings.currency,

        minRental: String(settings.min_rental),
        maxRental: String(settings.max_rental),
        advanceBooking: String(settings.advance_booking),
        lateFee: String(settings.late_fee),

        sameDayBooking: Boolean(settings.same_day_booking),
        autoAvailability: Boolean(settings.auto_availability),

        autoConfirm: Boolean(settings.auto_confirm),
        adminApproval: Boolean(settings.admin_approval),
        allowCancellation: Boolean(settings.allow_cancellation),
        allowModification: Boolean(settings.allow_modification),

        tax: String(settings.tax),
        deposit: String(settings.deposit),
        onlinePayment: Boolean(settings.online_payment),
        cashPayment: Boolean(settings.cash_payment),

        newBooking: Boolean(settings.new_booking),
        bookingCancellation: Boolean(
          settings.booking_cancellation
        ),
        newUser: Boolean(settings.new_user),
        vehicleAdded: Boolean(settings.vehicle_added),
        adminAlerts: Boolean(settings.admin_alerts),

        twoFactor: Boolean(settings.two_factor),
        loginAlerts: Boolean(settings.login_alerts),

        maintenanceMode: Boolean(
          settings.maintenance_mode
        ),

        updatedAt: settings.updated_at,
      },
    });
  } catch (error) {
    console.error("Admin settings GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch settings.",
      },
      { status: 500 }
    );
  }
}

// ======================================================
// PUT - UPDATE SETTINGS
// ======================================================

export async function PUT(request: Request) {
  try {
    const auth = checkAdmin(request);

    if (!auth.success) {
      return auth.response;
    }

    await createSettingsTable();

    const body = await request.json();

    const {
      appName,
      supportEmail,
      supportPhone,
      location,
      currency,

      minRental,
      maxRental,
      advanceBooking,
      lateFee,

      sameDayBooking,
      autoAvailability,

      autoConfirm,
      adminApproval,
      allowCancellation,
      allowModification,

      tax,
      deposit,
      onlinePayment,
      cashPayment,

      newBooking,
      bookingCancellation,
      newUser,
      vehicleAdded,
      adminAlerts,

      twoFactor,
      loginAlerts,

      maintenanceMode,
    } = body;

    // ==================================================
    // VALIDATION
    // ==================================================

    if (
      !appName ||
      !supportEmail ||
      !supportPhone ||
      !location ||
      !currency
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Application name, email, phone, location and currency are required.",
        },
        { status: 400 }
      );
    }

    if (
      Number(minRental) < 1 ||
      Number(maxRental) < Number(minRental)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Rental duration values are invalid.",
        },
        { status: 400 }
      );
    }

    // ==================================================
    // UPDATE
    // ==================================================

    await pool.execute(
      `
      UPDATE settings
      SET

        app_name = ?,
        support_email = ?,
        support_phone = ?,
        location = ?,
        currency = ?,

        min_rental = ?,
        max_rental = ?,
        advance_booking = ?,
        late_fee = ?,

        same_day_booking = ?,
        auto_availability = ?,

        auto_confirm = ?,
        admin_approval = ?,
        allow_cancellation = ?,
        allow_modification = ?,

        tax = ?,
        deposit = ?,
        online_payment = ?,
        cash_payment = ?,

        new_booking = ?,
        booking_cancellation = ?,
        new_user = ?,
        vehicle_added = ?,
        admin_alerts = ?,

        two_factor = ?,
        login_alerts = ?,

        maintenance_mode = ?

      WHERE id = 1
      `,
      [
        appName.trim(),
        supportEmail.trim().toLowerCase(),
        supportPhone.trim(),
        location.trim(),
        currency,

        Number(minRental),
        Number(maxRental),
        Number(advanceBooking),
        Number(lateFee),

        Boolean(sameDayBooking),
        Boolean(autoAvailability),

        Boolean(autoConfirm),
        Boolean(adminApproval),
        Boolean(allowCancellation),
        Boolean(allowModification),

        Number(tax),
        Number(deposit),
        Boolean(onlinePayment),
        Boolean(cashPayment),

        Boolean(newBooking),
        Boolean(bookingCancellation),
        Boolean(newUser),
        Boolean(vehicleAdded),
        Boolean(adminAlerts),

        Boolean(twoFactor),
        Boolean(loginAlerts),

        Boolean(maintenanceMode),
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully.",
    });
  } catch (error) {
    console.error("Admin settings PUT error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update settings.",
      },
      { status: 500 }
    );
  }
}