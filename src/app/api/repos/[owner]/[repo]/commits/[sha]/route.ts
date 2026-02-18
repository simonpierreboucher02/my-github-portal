import { NextRequest, NextResponse } from "next/server";
import { getCommit } from "@/lib/github";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ owner: string; repo: string; sha: string }> }
) {
  const { owner, repo, sha } = await params;
  try {
    const commit = await getCommit(owner, repo, sha);
    return NextResponse.json(commit);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch commit" },
      { status: 500 }
    );
  }
}
