import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Parse the JSON request body
    const data = await request.json();

    // Validate required fields
    const requiredFields = ["name", "email", "phone"];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          {
            success: false,
            message: `Missing required field: ${field}`,
          },
          { status: 400 }
        );
      }
    }

    // Validate email format
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email format",
        },
        { status: 400 }
      );
    }

    // Here you would typically store the waitlist entry in a database
    // For example: await db.waitlist.create({ data });

    // Log the waitlist data (remove in production)
    console.log("Waitlist entry received:", data);

    return NextResponse.json(
      {
        success: true,
        message: "Added to waitlist successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing waitlist entry:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process waitlist entry",
      },
      { status: 500 }
    );
  }
}
