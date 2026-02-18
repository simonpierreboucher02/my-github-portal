"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import FileViewer from "@/components/FileViewer";

interface FileEntry {
  name: string;
  path: string;
  type: "file" | "dir";
  size?: number;
}

interface RepoInfo {
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  default_branch: string;
  html_url: string;
  language: string;
  open_issues_count: number;
  created_at: string;
  updated_at: string;
}

interface Branch {
  name: string;
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6", JavaScript: "#f1e05a", Python: "#3572A5",
  Java: "#b07219", Go: "#00ADD8", Rust: "#dea584", "C++": "#f34b7d",
  C: "#555555", Ruby: "#701516", PHP: "#4F5D95", Swift: "#F05138",
  R: "#198CE7", TeX: "#3D6117", "Jupyter Notebook": "#DA5B0B",
  HTML: "#e34c26", CSS: "#563d7c", Shell: "#89e051",
};

export default function RepoPage({
  params,
}: {
  params: Promise<{ owner: string; name: string }>;
}) {
  const { owner, name } = use(params);
  const [repoInfo, setRepoInfo] = useState<RepoInfo | null>(null);
  const [contents, setContents] = useState<FileEntry[]>([]);
  const [currentPath, setCurrentPath] = useState("");
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(true);
  const [fileLoading, setFileLoading] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [currentBranch, setCurrentBranch] = useState("");
  const [languages, setLanguages] = useState<Record<string, number>>({});
  const [tab, setTab] = useState<"code" | "commits">("code");

  useEffect(() => {
    Promise.all([
      fetch(`/api/repos/${owner}/${name}`).then((r) => r.json()),
      fetch(`/api/repos/${owner}/${name}/branches`).then((r) => r.json()),
      fetch(`/api/repos/${owner}/${name}/languages`).then((r) => r.json()),
    ]).then(([info, branchList, langs]) => {
      setRepoInfo(info);
      setBranches(Array.isArray(branchList) ? branchList : []);
      setLanguages(langs || {});
      setCurrentBranch(info.default_branch || "main");
      setLoading(false);
    });
  }, [owner, name]);

  useEffect(() => {
    if (!currentBranch) return;
    loadContents(currentPath);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentBranch]);

  async function loadContents(path: string) {
    setFileContent(null);
    setFileLoading(true);
    try {
      const res = await fetch(`/api/repos/${owner}/${name}/contents?path=${encodeURIComponent(path)}&ref=${currentBranch}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        const sorted = data.sort((a: FileEntry, b: FileEntry) => {
          if (a.type === b.type) return a.name.localeCompare(b.name);
          return a.type === "dir" ? -1 : 1;
        });
        setContents(sorted);
        setCurrentPath(path);
      }
    } catch { /* */ }
    setFileLoading(false);
  }

  async function loadFile(path: string, fname: string) {
    setFileLoading(true);
    try {
      const res = await fetch(`/api/repos/${owner}/${name}/file?path=${encodeURIComponent(path)}&ref=${currentBranch}`);
      const data = await res.json();
      if (data.decodedContent) {
        setFileContent(data.decodedContent);
        setFileName(fname);
      }
    } catch { /* */ }
    setFileLoading(false);
  }

  function navigateTo(entry: FileEntry) {
    if (entry.type === "dir") loadContents(entry.path);
    else loadFile(entry.path, entry.name);
  }

  function goUp() {
    setFileContent(null);
    const parts = currentPath.split("/").filter(Boolean);
    parts.pop();
    loadContents(parts.join("/"));
  }

  function goToRoot() {
    setFileContent(null);
    loadContents("");
  }

  const pathParts = currentPath.split("/").filter(Boolean);
  const totalLangBytes = Object.values(languages).reduce((a, b) => a + b, 0);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-[3px]" style={{ borderColor: "var(--spinner-track)", borderTopColor: "var(--spinner-fill)" }} />
        <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>Chargement du repository...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Repo header */}
      <div className="mb-6 animate-fadeInUp">
        <div className="flex items-center gap-2 text-sm mb-3" style={{ color: "var(--text-secondary)" }}>
          <Link href="/" className="transition hover:underline" style={{ color: "var(--text-secondary)" }}>Repositories</Link>
          <span style={{ color: "var(--text-tertiary)" }}>/</span>
          <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{owner}/{name}</span>
        </div>

        {repoInfo && (
          <div className="p-5 rounded-xl border" style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-secondary)" }}>
            <div className="flex flex-wrap items-center gap-3">
              <a href={repoInfo.html_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition" style={{ backgroundColor: "var(--accent-subtle)", color: "var(--accent)" }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>
                Voir sur GitHub
              </a>
              <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-md" style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-secondary)" }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" /></svg>
                {repoInfo.stargazers_count}
              </span>
              <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-md" style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-secondary)" }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z" /></svg>
                {repoInfo.forks_count}
              </span>
            </div>
            {repoInfo.description && (
              <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{repoInfo.description}</p>
            )}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit" style={{ backgroundColor: "var(--bg-secondary)" }}>
        {(["code", "commits"] as const).map((t) => (
          <button
            key={t}
            onClick={() => { if (t === "code") { setTab("code"); goToRoot(); } else setTab(t); }}
            className="px-4 py-2 text-sm font-medium rounded-lg transition-all capitalize"
            style={{
              backgroundColor: tab === t ? "var(--bg-primary)" : "transparent",
              color: tab === t ? "var(--text-primary)" : "var(--text-secondary)",
              boxShadow: tab === t ? "var(--shadow-card)" : "none",
            }}
          >
            {t === "code" ? "Code" : "Commits"}
          </button>
        ))}
      </div>

      {tab === "code" ? (
        <>
          {/* Branch + breadcrumb */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{ color: "var(--icon-color)" }}>
                <path d="M11.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122V6A2.5 2.5 0 0110 8.5H6a1 1 0 00-1 1v1.128a2.251 2.251 0 11-1.5 0V5.372a2.25 2.25 0 111.5 0v1.836A2.492 2.492 0 016 7h4a1 1 0 001-1v-.628A2.25 2.25 0 019.5 3.25zM4.25 12a.75.75 0 100 1.5.75.75 0 000-1.5zM3.5 3.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0z" />
              </svg>
              <select
                value={currentBranch}
                onChange={(e) => { setCurrentBranch(e.target.value); setCurrentPath(""); setFileContent(null); }}
                className="border text-sm rounded-lg px-3 py-1.5 outline-none cursor-pointer"
                style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}
              >
                {branches.map((b) => <option key={b.name} value={b.name}>{b.name}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-1 text-sm flex-wrap">
              <button onClick={goToRoot} className="hover:underline font-semibold" style={{ color: "var(--accent)" }}>{name}</button>
              {pathParts.map((part, i) => (
                <span key={i} className="flex items-center gap-1">
                  <span style={{ color: "var(--text-tertiary)" }}>/</span>
                  <button
                    onClick={() => { setFileContent(null); loadContents(pathParts.slice(0, i + 1).join("/")); }}
                    style={{ color: i === pathParts.length - 1 ? "var(--text-primary)" : "var(--accent)", fontWeight: i === pathParts.length - 1 ? 600 : 400 }}
                    className={i < pathParts.length - 1 ? "hover:underline" : ""}
                  >{part}</button>
                </span>
              ))}
            </div>
          </div>

          {fileLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-[3px]" style={{ borderColor: "var(--spinner-track)", borderTopColor: "var(--spinner-fill)" }} />
            </div>
          ) : fileContent !== null ? (
            <div className="animate-fadeInUp">
              <button onClick={goUp} className="hover:underline text-sm mb-4 flex items-center gap-1.5 transition" style={{ color: "var(--accent)" }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M7.78 12.53a.75.75 0 01-1.06 0L2.47 8.28a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 1.06L4.81 7h7.44a.75.75 0 010 1.5H4.81l2.97 2.97a.75.75 0 010 1.06z" /></svg>
                Retour
              </button>
              <FileViewer code={fileContent} filename={fileName} />
            </div>
          ) : (
            <div className="rounded-xl overflow-hidden animate-fadeInUp" style={{ boxShadow: "var(--shadow-card)" }}>
              {currentPath && (
                <button
                  onClick={goUp}
                  className="w-full text-left px-4 py-2.5 text-sm border-b flex items-center gap-3 transition"
                  style={{ color: "var(--accent)", borderColor: "var(--border-color)", backgroundColor: "var(--bg-card)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-hover)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-card)")}
                >
                  <svg width="16" height="16" viewBox="0 0 12 12" fill="currentColor" style={{ color: "var(--icon-color)" }}><path d="M2.5 1.75a.75.75 0 00-1.5 0v8.5c0 .966.784 1.75 1.75 1.75h7.5A1.75 1.75 0 0012 10.25v-6.5A1.75 1.75 0 0010.25 2H6.56L5.28.72A.75.75 0 004.78.5H2.5v1.25z" /></svg>
                  ..
                </button>
              )}
              {contents.map((entry, idx) => (
                <button
                  key={entry.path}
                  onClick={() => navigateTo(entry)}
                  className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 transition"
                  style={{ borderTop: idx > 0 || currentPath ? "1px solid var(--border-color)" : undefined, backgroundColor: "var(--bg-card)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-hover)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-card)")}
                >
                  {entry.type === "dir" ? (
                    <svg width="16" height="16" viewBox="0 0 12 12" fill="currentColor" style={{ color: "#54aeff" }}><path d="M2.5 1.75a.75.75 0 00-1.5 0v8.5c0 .966.784 1.75 1.75 1.75h7.5A1.75 1.75 0 0012 10.25v-6.5A1.75 1.75 0 0010.25 2H6.56L5.28.72A.75.75 0 004.78.5H2.5v1.25z" /></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{ color: "var(--icon-color)" }}><path d="M3.75 1.5a.25.25 0 00-.25.25v11.5c0 .138.112.25.25.25h8.5a.25.25 0 00.25-.25V6H9.75A1.75 1.75 0 018 4.25V1.5H3.75zm5.75.56v2.19c0 .138.112.25.25.25h2.19L9.5 2.06zM2 1.75C2 .784 2.784 0 3.75 0h5.086c.464 0 .909.184 1.237.513l3.414 3.414c.329.328.513.773.513 1.237v8.086A1.75 1.75 0 0112.25 15h-8.5A1.75 1.75 0 012 13.25V1.75z" /></svg>
                  )}
                  <span style={{ color: "var(--text-primary)", fontWeight: entry.type === "dir" ? 500 : 400 }}>{entry.name}</span>
                  {entry.size !== undefined && entry.type === "file" && (
                    <span className="ml-auto text-xs font-mono" style={{ color: "var(--text-tertiary)" }}>
                      {entry.size > 1024 ? `${(entry.size / 1024).toFixed(1)} KB` : `${entry.size} B`}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Languages */}
          {totalLangBytes > 0 && !fileContent && (
            <div className="mt-6 p-4 rounded-xl" style={{ backgroundColor: "var(--bg-secondary)" }}>
              <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Languages</h3>
              <div className="flex rounded-full overflow-hidden h-2.5 mb-3">
                {Object.entries(languages).map(([lang, bytes]) => (
                  <div key={lang} style={{ width: `${(bytes / totalLangBytes) * 100}%`, backgroundColor: LANG_COLORS[lang] || "#8b949e" }} className="h-full" title={`${lang}: ${((bytes / totalLangBytes) * 100).toFixed(1)}%`} />
                ))}
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                {Object.entries(languages).map(([lang, bytes]) => (
                  <span key={lang} className="flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: LANG_COLORS[lang] || "#8b949e" }} />
                    {lang} <span style={{ color: "var(--text-tertiary)" }}>{((bytes / totalLangBytes) * 100).toFixed(1)}%</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <CommitsTab owner={owner} name={name} />
      )}
    </div>
  );
}

function CommitsTab({ owner, name }: { owner: string; name: string }) {
  const [commits, setCommits] = useState<Array<{ sha: string; commit: { message: string; author: { name: string; date: string } }; author?: { avatar_url: string; login: string } }>>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => { loadCommits(1); }, [owner, name]);

  async function loadCommits(p: number) {
    setLoading(true);
    try {
      const res = await fetch(`/api/repos/${owner}/${name}/commits?page=${p}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setCommits(p === 1 ? data : (prev) => [...prev, ...data]);
        setHasMore(data.length === 30);
        setPage(p);
      }
    } catch { /* */ }
    setLoading(false);
  }

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `il y a ${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `il y a ${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `il y a ${days}j`;
    return `il y a ${Math.floor(days / 30)} mois`;
  }

  return (
    <div>
      <div className="rounded-xl overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
        {commits.map((c, idx) => (
          <Link
            key={c.sha}
            href={`/repo/${owner}/${name}/commit/${c.sha}`}
            className="block px-4 py-3.5 transition"
            style={{ borderTop: idx > 0 ? "1px solid var(--border-color)" : undefined, backgroundColor: "var(--bg-card)" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-card)")}
          >
            <div className="flex items-start gap-3">
              {c.author?.avatar_url ? (
                <img src={c.author.avatar_url} alt={c.author.login} className="w-8 h-8 rounded-full flex-shrink-0 mt-0.5 ring-1 ring-black/10" />
              ) : (
                <div className="w-8 h-8 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center text-xs font-bold" style={{ backgroundColor: "var(--accent-subtle)", color: "var(--accent)" }}>
                  {c.commit.author.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>{c.commit.message.split("\n")[0]}</p>
                <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs" style={{ color: "var(--text-secondary)" }}>
                  <span className="font-medium">{c.commit.author.name}</span>
                  <span>{timeAgo(c.commit.author.date)}</span>
                  <code className="px-1.5 py-0.5 rounded-md text-[11px] font-mono" style={{ backgroundColor: "var(--accent-subtle)", color: "var(--accent)" }}>{c.sha.substring(0, 7)}</code>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-7 w-7 border-[3px]" style={{ borderColor: "var(--spinner-track)", borderTopColor: "var(--spinner-fill)" }} />
        </div>
      )}

      {hasMore && !loading && (
        <div className="text-center mt-5">
          <button
            onClick={() => loadCommits(page + 1)}
            className="text-sm px-5 py-2.5 rounded-xl transition-all font-medium"
            style={{ backgroundColor: "var(--bg-secondary)", color: "var(--text-primary)", boxShadow: "var(--shadow-card)" }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-card-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-card)")}
          >
            Charger plus de commits
          </button>
        </div>
      )}
    </div>
  );
}
