import { NextResponse } from "next/server";
import pool from "@/lib/db";
import type { RowDataPacket } from "mysql2";

export async function GET() {
    try {

        // USERS


        const [usersResult] = await pool.query<RowDataPacket[]>(`
            SELECT COUNT(*) AS total
            FROM users
        `);

        // CARS

        const [carsResult] = await pool.query<RowDataPacket[]>(`
            SELECT COUNT(*) AS total
            FROM vehicles
        `);


        // BIKES

        const [bikesResult] = await pool.query<RowDataPacket[]>(`
            SELECT COUNT(*) AS total
            FROM bikes
        `);

        // BOOKINGS

        const [bookingsResult] = await pool.query<RowDataPacket[]>(`
            SELECT COUNT(*) AS total
            FROM bookings
        `);

        // REVENUE

        const [revenueResult] = await pool.query<RowDataPacket[]>(`
            SELECT
                COALESCE(SUM(total_amount), 0) AS total
            FROM bookings
            WHERE LOWER(COALESCE(status, '')) != 'cancelled'
        `);

        // CURRENTLY RENTED CARS

        const [rentedCarsResult] = await pool.query<RowDataPacket[]>(`
            SELECT
                COUNT(DISTINCT vehicle_id) AS total
            FROM bookings
            WHERE vehicle_id IS NOT NULL
                AND LOWER(COALESCE(status, '')) != 'cancelled'
                AND NOW() >= TIMESTAMP(
                    pickup_date,
                    pickup_time
                )
                AND NOW() < TIMESTAMP(
                    return_date,
                    return_time
                )
        `);


        // CURRENTLY RENTED BIKES


        const [rentedBikesResult] = await pool.query<RowDataPacket[]>(`
            SELECT
                COUNT(DISTINCT bike_id) AS total
            FROM bookings
            WHERE bike_id IS NOT NULL
                AND LOWER(COALESCE(status, '')) != 'cancelled'
                AND NOW() >= TIMESTAMP(
                    pickup_date,
                    pickup_time
                )
                AND NOW() < TIMESTAMP(
                    return_date,
                    return_time
                )
        `);

        // CONVERT VALUES


        const users = Number(
            usersResult[0]?.total ?? 0
        );

        const cars = Number(
            carsResult[0]?.total ?? 0
        );

        const bikes = Number(
            bikesResult[0]?.total ?? 0
        );

        const bookings = Number(
            bookingsResult[0]?.total ?? 0
        );

        const revenue = Number(
            revenueResult[0]?.total ?? 0
        );

        const rentedCars = Number(
            rentedCarsResult[0]?.total ?? 0
        );

        const rentedBikes = Number(
            rentedBikesResult[0]?.total ?? 0
        );


        // CALCULATIONS


        const totalVehicles =
            cars + bikes;

        const currentlyRented =
            rentedCars + rentedBikes;

        const availableVehicles = Math.max(
            totalVehicles - currentlyRented,
            0
        );


        // RESPONSE


        return NextResponse.json({
            success: true,

            stats: {
                users,
                cars,
                bikes,
                bookings,
                revenue,
                rentedCars,
                rentedBikes,
                currentlyRented,
                availableVehicles,
                totalVehicles,
            },
        });

    } catch (error) {

        console.error(
            "ADMIN STATS ERROR:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Failed to load admin statistics",
                error:
                    process.env.NODE_ENV ===
                        "development"
                        ? error instanceof Error
                            ? error.message
                            : undefined
                        : undefined,
            },
            {
                status: 500,
            }
        );
    }
}