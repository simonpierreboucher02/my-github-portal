import { NextRequest, NextResponse } from "next/server";
import { getRepoContents } from "@/lib/github";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ owner: string; repo: string }> }
) {
  const { owner, repo } = await params;
  const searchParams = request.nextUrl.searchParams;
  const path = searchParams.get("path") || "";
  const ref = searchParams.get("ref") || "";

  try {
    const contents = await getRepoContents(owner, repo, path, ref);
    return NextResponse.json(contents);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch contents" },
      { status: 500 }
    );
  }
}
