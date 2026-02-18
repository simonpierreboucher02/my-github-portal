"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";

interface CommitFile {
  filename: string;
  status: string;
  additions: number;
  deletions: number;
  patch?: string;
}

interface CommitDetail {
  sha: string;
  commit: {
    message: string;
    author: { name: string; date: string; email: string };
  };
  author?: { avatar_url: string; login: string };
  stats: { additions: number; deletions: number; total: number };
  files: CommitFile[];
}

export default function CommitPage({
  params,
}: {
  params: Promise<{ owner: string; name: string; sha: string }>;
}) {
  const { owner, name, sha } = use(params);
  const [commit, setCommit] = useState<CommitDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/repos/${owner}/${name}/commits/${sha}`)
      .then((r) => r.json())
      .then((data) => {
        setCommit(data);
        setLoading(false);
      });
  }, [owner, name, sha]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-2" style={{ borderColor: "var(--spinner-track)", borderTopColor: "var(--spinner-fill)" }} />
      </div>
    );
  }

  if (!commit) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-4 flex-wrap" style={{ color: "var(--text-secondary)" }}>
        <Link href="/" className="transition" style={{ color: "var(--text-secondary)" }} onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")} onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}>
          Repositories
        </Link>
        <span>/</span>
        <Link
          href={`/repo/${owner}/${name}`}
          className="transition"
          style={{ color: "var(--text-secondary)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
        >
          {owner}/{name}
        </Link>
        <span>/</span>
        <span style={{ color: "var(--text-primary)" }}>Commit</span>
      </div>

      {/* Commit info */}
      <div className="border rounded-lg p-6 mb-6" style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-secondary)" }}>
        <div className="flex items-start gap-4">
          {commit.author?.avatar_url && (
            <img
              src={commit.author.avatar_url}
              alt={commit.author.login}
              className="w-12 h-12 rounded-full flex-shrink-0"
            />
          )}
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-semibold mb-2 whitespace-pre-wrap" style={{ color: "var(--text-primary)" }}>
              {commit.commit.message}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
              <span className="font-medium" style={{ color: "var(--text-primary)" }}>
                {commit.commit.author.name}
              </span>
              <span>
                {new Date(commit.commit.author.date).toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <code className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: "var(--bg-primary)", color: "var(--accent)" }}>
                {sha.substring(0, 7)}
              </code>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t text-sm" style={{ borderColor: "var(--border-color)" }}>
          <span style={{ color: "var(--text-secondary)" }}>
            {commit.files?.length || 0} fichier{(commit.files?.length || 0) !== 1 ? "s" : ""} modifie{(commit.files?.length || 0) !== 1 ? "s" : ""}
          </span>
          <span style={{ color: "var(--success)" }}>
            +{commit.stats?.additions || 0}
          </span>
          <span style={{ color: "var(--danger)" }}>
            -{commit.stats?.deletions || 0}
          </span>
        </div>
      </div>

      {/* Files */}
      <div className="space-y-4">
        {commit.files?.map((file) => (
          <div
            key={file.filename}
            className="border rounded-lg overflow-hidden"
            style={{ borderColor: "var(--border-color)" }}
          >
            <div className="px-4 py-2 border-b flex items-center justify-between flex-wrap gap-2" style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)" }}>
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="text-xs font-mono font-bold"
                  style={{
                    color: file.status === "added" ? "var(--success)"
                      : file.status === "removed" ? "var(--danger)"
                      : file.status === "renamed" ? "var(--accent)"
                      : "var(--warning)",
                  }}
                >
                  {file.status === "added" ? "A" : file.status === "removed" ? "D" : file.status === "renamed" ? "R" : "M"}
                </span>
                <span className="text-sm font-mono truncate" style={{ color: "var(--text-primary)" }}>
                  {file.filename}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span style={{ color: "var(--success)" }}>+{file.additions}</span>
                <span style={{ color: "var(--danger)" }}>-{file.deletions}</span>
              </div>
            </div>

            {file.patch && (
              <div className="overflow-x-auto" style={{ backgroundColor: "var(--code-bg)" }}>
                <pre className="text-[13px] font-mono leading-[1.5]">
                  {file.patch.split("\n").map((line, i) => {
                    let bgColor = "transparent";
                    let textColor = "var(--text-primary)";
                    if (line.startsWith("+") && !line.startsWith("+++")) {
                      bgColor = "var(--diff-add-bg)";
                      textColor = "var(--diff-add-text)";
                    } else if (line.startsWith("-") && !line.startsWith("---")) {
                      bgColor = "var(--diff-remove-bg)";
                      textColor = "var(--diff-remove-text)";
                    } else if (line.startsWith("@@")) {
                      bgColor = "var(--diff-hunk-bg)";
                      textColor = "var(--diff-hunk-text)";
                    }
                    return (
                      <div
                        key={i}
                        className="px-4"
                        style={{ backgroundColor: bgColor, color: textColor }}
                      >
                        {line}
                      </div>
                    );
                  })}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
