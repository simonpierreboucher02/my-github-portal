import { NextRequest, NextResponse } from "next/server";
import { getLanguages } from "@/lib/github";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ owner: string; repo: string }> }
) {
  const { owner, repo } = await params;
  try {
    const languages = await getLanguages(owner, repo);
    return NextResponse.json(languages);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch languages" },
      { status: 500 }
    );
  }
}
