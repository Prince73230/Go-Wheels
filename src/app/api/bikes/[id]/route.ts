import { NextResponse } from "next/server";
import pool from "@/lib/db";
import type { RowDataPacket } from "mysql2";

// =====================================================
// GET SINGLE BIKE
// =====================================================

export async function GET(
    request: Request,
    context: {
        params: Promise<{ id: string }>;
    }
) {
    try {
        const { id } = await context.params;

        const [rows] = await pool.execute<RowDataPacket[]>(
            `
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
            FROM bikes
            WHERE id = ?
            `,
            [id]
        );

        if (rows.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Bike not found.",
                },
                {
                    status: 404,
                }
            );
        }

        return NextResponse.json({
            success: true,
            bike: rows[0],
        });

    } catch (error) {
        console.error(
            "Fetching single bike error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch bike.",
            },
            {
                status: 500,
            }
        );
    }
}


// =====================================================
// PUT - UPDATE SINGLE BIKE
// =====================================================

export async function PUT(
    request: Request,
    context: {
        params: Promise<{ id: string }>;
    }
) {
    try {
        const { id } = await context.params;

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

        // Check if bike exists

        const [bikeRows] = await pool.execute<RowDataPacket[]>(
            `
            SELECT id
            FROM bikes
            WHERE id = ?
            `,
            [id]
        );

        if (bikeRows.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Bike not found.",
                },
                {
                    status: 404,
                }
            );
        }

        // Update bike

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
                price_per_day,
                location,
                image_url,
                status,
                id,
            ]
        );

        // Get updated bike

        const [updatedRows] =
            await pool.execute<RowDataPacket[]>(
                `
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
                FROM bikes
                WHERE id = ?
                `,
                [id]
            );

        return NextResponse.json({
            success: true,
            message: "Bike updated successfully.",
            bike: updatedRows[0],
        });

    } catch (error) {
        console.error(
            "Updating bike error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message: "Failed to update bike.",
            },
            {
                status: 500,
            }
        );
    }
}


// =====================================================
// DELETE SINGLE BIKE
// =====================================================

export async function DELETE(
    request: Request,
    context: {
        params: Promise<{ id: string }>;
    }
) {
    try {
        const { id } = await context.params;

        // Check if bike exists

        const [bikeRows] = await pool.execute<RowDataPacket[]>(
            `
            SELECT id
            FROM bikes
            WHERE id = ?
            `,
            [id]
        );

        if (bikeRows.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Bike not found.",
                },
                {
                    status: 404,
                }
            );
        }

        // Check whether this bike
        // has existing bookings

        const [bookingRows] =
            await pool.execute<RowDataPacket[]>(
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
                        "This bike cannot be deleted because it has existing bookings.",
                },
                {
                    status: 409,
                }
            );
        }

        // Delete bike

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
        console.error(
            "Deleting bike error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Failed to delete bike.",
            },
            {
                status: 500,
            }
        );
    }
}