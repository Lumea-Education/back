import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Parse the JSON request body
    const data = await request.json();

    // Validate required fields
    const requiredFields = ["name", "email", "phone", "inquiryType", "message"];
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

    // Here you would typically:
    // 1. Store the contact request in a database
    // 2. Send notification emails
    // 3. Create a ticket in your support system

    // For example:
    // await db.contactRequests.create({ data });
    // await sendNotificationEmail(data);

    // Log the contact data (remove in production)
    console.log("Contact request received:", data);

    return NextResponse.json(
      {
        success: true,
        message: "Contact request submitted successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing contact request:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process contact request",
      },
      { status: 500 }
    );
  }
}
