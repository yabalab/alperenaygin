import { NextResponse } from "next/server";
import { getAvailability } from "@/lib/booking";

// Public endpoint the booking modal fetches on open. Server-side computes real
// availability (confirmed appointments + blocked_slots) via the admin client;
// only derived slot lists are returned. Always fresh so admin changes reflect.
export const dynamic = "force-dynamic";

export async function GET() {
  const availability = await getAvailability();
  return NextResponse.json(availability, {
    headers: { "Cache-Control": "no-store" },
  });
}
