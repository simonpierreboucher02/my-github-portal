import fs from "fs";
import path from "path";

export interface RepoEntry {
  id: string;
  owner: string;
  name: string;
  fullName: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  url: string;
  addedAt: string;
}

const DATA_FILE = path.join(process.cwd(), "data", "repos.json");

function ensureDataDir() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
  }
}

export function getRepos(): RepoEntry[] {
  ensureDataDir();
  const data = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(data);
}

export function addRepo(repo: RepoEntry): void {
  ensureDataDir();
  const repos = getRepos();
  const exists = repos.find((r) => r.fullName === repo.fullName);
  if (exists) throw new Error("Repository already added");
  repos.push(repo);
  fs.writeFileSync(DATA_FILE, JSON.stringify(repos, null, 2));
}

export function removeRepo(id: string): void {
  ensureDataDir();
  let repos = getRepos();
  repos = repos.filter((r) => r.id !== id);
  fs.writeFileSync(DATA_FILE, JSON.stringify(repos, null, 2));
}
