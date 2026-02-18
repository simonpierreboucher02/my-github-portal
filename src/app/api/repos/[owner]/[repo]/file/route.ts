import { NextRequest, NextResponse } from "next/server";
import { getFileContent } from "@/lib/github";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ owner: string; repo: string }> }
) {
  const { owner, repo } = await params;
  const searchParams = request.nextUrl.searchParams;
  const path = searchParams.get("path") || "";
  const ref = searchParams.get("ref") || "";

  try {
    const file = await getFileContent(owner, repo, path, ref);
    return NextResponse.json(file);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch file" },
      { status: 500 }
    );
  }
}
