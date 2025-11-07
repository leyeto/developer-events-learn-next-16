import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Event, { IEvent } from '@/database/event.model';

/**
 * GET /api/events/[slug]
 * Fetches a single event by its slug
 *
 * @param request - Next.js request object
 * @param params - Route parameters containing the slug
 * @returns Event data or error response
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  try {
    // Await params to get the slug value
    const { slug } = await params;

    // Validate slug parameter
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json(
        {
          message: 'Validation Error',
          error: 'Slug parameter is required and must be a valid string',
        },
        { status: 400 }
      );
    }

    // Validate slug format (alphanumeric, hyphens, not empty after trim)
    const trimmedSlug = slug.trim().toLowerCase();
    if (!trimmedSlug || !/^[a-z0-9-]+$/.test(trimmedSlug)) {
      return NextResponse.json(
        {
          message: 'Validation Error',
          error:
            'Slug must contain only lowercase letters, numbers, and hyphens',
        },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Query event by slug
    const event = await Event.findOne({
      slug: trimmedSlug,
    }).lean();

    // Handle event not found
    if (!event) {
      return NextResponse.json(
        {
          message: 'Event Not Found',
          error: `No event found with slug: ${trimmedSlug}`,
        },
        { status: 404 }
      );
    }

    // Return successful response
    return NextResponse.json(
      {
        message: 'Event fetched successfully',
        event,
      },
      { status: 200 }
    );
  } catch (error) {
    // Log error for debugging (remove in production or use proper logging service)
    console.error('Error fetching event by slug:', error);

    // Handle unexpected errors
    return NextResponse.json(
      {
        message: 'Internal Server Error',
        error:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred while fetching the event',
      },
      { status: 500 }
    );
  }
}
