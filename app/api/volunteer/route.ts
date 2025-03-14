import { type NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Configure where uploaded files will be stored
const UPLOAD_DIR = path.join(process.cwd(), "uploads", "volunteer");

export async function POST(request: NextRequest) {
  try {
    // Parse the multipart form data
    const formData = await request.formData();

    // Create a unique ID for this volunteer application
    const applicationId = uuidv4();

    // Extract form fields
    const applicationData: Record<string, any> = {};
    const filePromises: Promise<void>[] = [];

    // Process each form field
    for (const [key, value] of formData.entries()) {
      // Handle file uploads
      if (value instanceof File) {
        const fileName = `${applicationId}-${key}-${value.name}`;
        const filePath = path.join(UPLOAD_DIR, fileName);

        // Store file information in application data
        applicationData[key] = {
          originalName: value.name,
          storedPath: filePath,
          contentType: value.type,
          size: value.size,
        };

        // Create a promise to write the file
        const buffer = Buffer.from(await value.arrayBuffer());
        filePromises.push(writeFile(filePath, buffer));
      } else {
        // Store regular form fields
        applicationData[key] = value;
      }
    }

    // Wait for all files to be written
    await Promise.all(filePromises);

    // Here you would typically store the volunteer application data in a database
    // For example: await db.volunteerApplications.create({ data: applicationData });

    // Log the application data (remove in production)
    console.log("Volunteer application received:", applicationData);

    // Return a success response
    return NextResponse.json(
      {
        success: true,
        message: "Volunteer application submitted successfully",
        applicationId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing volunteer application:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process volunteer application",
      },
      { status: 500 }
    );
  }
}
