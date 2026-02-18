import { NextRequest, NextResponse } from "next/server";
import { getRepoInfo } from "@/lib/github";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ owner: string; repo: string }> }
) {
  const { owner, repo } = await params;
  try {
    const info = await getRepoInfo(owner, repo);
    return NextResponse.json(info);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch repo info" },
      { status: 500 }
    );
  }
}
