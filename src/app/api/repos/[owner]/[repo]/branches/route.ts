import { NextRequest, NextResponse } from "next/server";
import { getBranches } from "@/lib/github";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ owner: string; repo: string }> }
) {
  const { owner, repo } = await params;
  try {
    const branches = await getBranches(owner, repo);
    return NextResponse.json(branches);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch branches" },
      { status: 500 }
    );
  }
}
