import { NextRequest, NextResponse } from "next/server";
import { getCommits } from "@/lib/github";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ owner: string; repo: string }> }
) {
  const { owner, repo } = await params;
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");

  try {
    const commits = await getCommits(owner, repo, page);
    return NextResponse.json(commits);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch commits" },
      { status: 500 }
    );
  }
}
