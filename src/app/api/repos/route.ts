import { NextRequest, NextResponse } from "next/server";
import { getRepos, addRepo, removeRepo } from "@/lib/store";
import { getRepoInfo, parseGithubUrl } from "@/lib/github";

const ADMIN_PASSWORD = "admin123";

function checkAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return false;
  const password = authHeader.replace("Bearer ", "");
  return password === ADMIN_PASSWORD;
}

export async function GET() {
  try {
    const repos = getRepos();
    return NextResponse.json(repos);
  } catch {
    return NextResponse.json({ error: "Failed to load repos" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { url } = await request.json();
    const parsed = parseGithubUrl(url);
    if (!parsed) {
      return NextResponse.json(
        { error: "Invalid GitHub URL" },
        { status: 400 }
      );
    }

    const info = await getRepoInfo(parsed.owner, parsed.repo);

    const repo = {
      id: crypto.randomUUID(),
      owner: parsed.owner,
      name: parsed.repo,
      fullName: `${parsed.owner}/${parsed.repo}`,
      description: info.description || "",
      language: info.language || "Unknown",
      stars: info.stargazers_count || 0,
      forks: info.forks_count || 0,
      url: info.html_url,
      addedAt: new Date().toISOString(),
    };

    addRepo(repo);
    return NextResponse.json(repo, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to add repo";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await request.json();
    removeRepo(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete repo" },
      { status: 500 }
    );
  }
}
