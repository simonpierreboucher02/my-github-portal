const GITHUB_API = "https://api.github.com";

async function ghFetch(endpoint: string) {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "my-github-portal",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${GITHUB_API}${endpoint}`, {
    headers,
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function getRepoInfo(owner: string, repo: string) {
  return ghFetch(`/repos/${owner}/${repo}`);
}

export async function getRepoContents(
  owner: string,
  repo: string,
  path: string = "",
  ref: string = ""
) {
  const query = ref ? `?ref=${ref}` : "";
  return ghFetch(`/repos/${owner}/${repo}/contents/${path}${query}`);
}

export async function getFileContent(
  owner: string,
  repo: string,
  path: string,
  ref: string = ""
) {
  const query = ref ? `?ref=${ref}` : "";
  const data = await ghFetch(`/repos/${owner}/${repo}/contents/${path}${query}`);
  if (data.content) {
    const content = Buffer.from(data.content, "base64").toString("utf-8");
    return { ...data, decodedContent: content };
  }
  return data;
}

export async function getCommits(
  owner: string,
  repo: string,
  page: number = 1,
  perPage: number = 30
) {
  return ghFetch(
    `/repos/${owner}/${repo}/commits?page=${page}&per_page=${perPage}`
  );
}

export async function getCommit(owner: string, repo: string, sha: string) {
  return ghFetch(`/repos/${owner}/${repo}/commits/${sha}`);
}

export async function getBranches(owner: string, repo: string) {
  return ghFetch(`/repos/${owner}/${repo}/branches`);
}

export async function getLanguages(owner: string, repo: string) {
  return ghFetch(`/repos/${owner}/${repo}/languages`);
}

export function parseGithubUrl(url: string): { owner: string; repo: string } | null {
  const patterns = [
    /github\.com\/([^\/]+)\/([^\/\s#?]+)/,
    /^([^\/]+)\/([^\/\s]+)$/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return { owner: match[1], repo: match[2].replace(/\.git$/, "") };
    }
  }
  return null;
}
