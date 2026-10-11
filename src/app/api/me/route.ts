import { NextResponse } from "next/server";
import {
  getSessionFromRequest,
} from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session =
      getSessionFromRequest(request);

    // ==========================================
    // NOT LOGGED IN
    // ==========================================

    if (!session) {
      return NextResponse.json({
        success: true,
        loggedIn: false,
        isAdmin: false,
        user: null,
      });
    }

    // ==========================================
    // LOGGED IN
    // ==========================================

    return NextResponse.json({
      success: true,
      loggedIn: true,
      isAdmin: session.isAdmin,
      user: {
        id: session.userId,
      },
    });

  } catch (error) {
    console.error(
      "Auth me error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        loggedIn: false,
        isAdmin: false,
        message: "Unable to check session.",
      },
      { status: 500 }
    );
  }
}