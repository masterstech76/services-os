import { NextRequest, NextResponse } from "next/server";

export interface ReviewEntity {
  id: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  rating: number; // 1-5
  reviewText: string;
  serviceTag: string;
  jobId?: string;
  invoiceId?: string;
  verificationStatus: "pending" | "verified" | "unverified";
  moderationStatus: "pending" | "approved" | "rejected" | "hidden";
  verifiedAt?: string;
  moderatedAt?: string;
  moderatedBy?: string;
  createdAt: string;
}

// In-memory persistent store for reviews runtime
const reviewsStore: ReviewEntity[] = [];

export async function GET() {
  // Public feed returns only reviews that are approved by admin moderation
  const approved = reviewsStore.filter((r) => r.moderationStatus === "approved");
  return NextResponse.json({ reviews: approved });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, rating, reviewText, serviceTag, jobId } = body;

    // Validate required fields
    if (!customerName || !rating || !reviewText) {
      return NextResponse.json(
        { error: "Missing required fields: customerName, rating, and reviewText are required." },
        { status: 400 }
      );
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return NextResponse.json(
        { error: "Rating must be a valid number between 1 and 5." },
        { status: 400 }
      );
    }

    // Zero Client Trust: client-supplied verification flags are always discarded
    // Reviews default to unverified unless matched with completed job in database
    const newReview: ReviewEntity = {
      id: `rev_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      customerName: String(customerName).trim().slice(0, 100),
      rating: numRating,
      reviewText: String(reviewText).trim().slice(0, 2000),
      serviceTag: String(serviceTag || "General HVAC").trim().slice(0, 50),
      jobId: jobId ? String(jobId).trim() : undefined,
      verificationStatus: "unverified",
      moderationStatus: "pending",
      createdAt: new Date().toISOString(),
    };

    reviewsStore.unshift(newReview);

    return NextResponse.json(
      {
        success: true,
        message: "Review submitted successfully and is queued for verification and moderation.",
        review: newReview,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process review submission." },
      { status: 500 }
    );
  }
}
