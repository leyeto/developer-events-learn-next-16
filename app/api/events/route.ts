import { NextRequest, NextResponse } from "next/server";
import Event from "@/database/event.model";
import connectDB from "@/lib/mongodb";
import { v2 as cloudinary } from "cloudinary";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    await connectDB();

    const formData = await req.formData();

    // Convert FormData to plain object
    const event = Object.fromEntries(formData);

    // Validate required fields
    const requiredFields = [
      "title",
      "description",
      "overview",
      "venue",
      "location",
      "date",
      "time",
      "mode",
      "audience",
      "agenda",
      "organizer",
      "tags",
    ];

    const missingFields = requiredFields.filter(
      (field) => !event[field] || event[field] === "",
    );

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          message: "Validation Error",
          error: `Missing required fields: ${missingFields.join(", ")}`,
        },
        { status: 400 },
      );
    }

    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json(
        { message: "Image file not found" },
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: "image", folder: "DevEvent" },
          (error, result) => {
            if (error) return reject(error);

            resolve(result);
          },
        )
        .end(buffer);
    });

    event.image = (uploadResult as { secure_url: string }).secure_url;

    const createdEvent = await Event.create(event);

    return NextResponse.json(
      { message: "Successfully created event", event: createdEvent },
      { status: 201 },
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        message: "Event Creation Failed",
        error: err instanceof Error ? err.message : "Unknown Error",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    const events = await Event.find().sort({ createdAt: -1 });

    return NextResponse.json(
      { message: "Event fetched successfully", events },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json(
      {
        message: "Event fetching failed",
        error: err instanceof Error ? err.message : "Unknown Error",
      },
      { status: 500 },
    );
  }
}
