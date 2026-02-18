"use client";

import { useState, useEffect } from "react";

interface Repo {
  id: string;
  owner: string;
  name: string;
  fullName: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  addedAt: string;
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [repos, setRepos] = useState<Repo[]>([]);
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("admin_token");
    if (stored) {
      setPassword(stored);
      setAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (authenticated) {
      loadRepos();
    }
  }, [authenticated]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      sessionStorage.setItem("admin_token", password);
      setAuthenticated(true);
    } else {
      setAuthError("Mot de passe incorrect");
    }
  }

  async function loadRepos() {
    const res = await fetch("/api/repos");
    const data = await res.json();
    setRepos(Array.isArray(data) ? data : []);
  }

  async function handleAddRepo(e: React.FormEvent) {
    e.preventDefault();
    if (!repoUrl.trim()) return;
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/repos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify({ url: repoUrl }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: `Repository "${data.fullName}" ajoute avec succes!` });
        setRepoUrl("");
        loadRepos();
      } else {
        setMessage({ type: "error", text: data.error || "Erreur lors de l'ajout" });
      }
    } catch {
      setMessage({ type: "error", text: "Erreur de connexion" });
    }
    setLoading(false);
  }

  async function handleDeleteRepo(id: string, name: string) {
    if (!confirm(`Supprimer le repository "${name}" ?`)) return;
    const res = await fetch("/api/repos", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${password}`,
      },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setMessage({ type: "success", text: `"${name}" supprime` });
      loadRepos();
    }
  }

  if (!authenticated) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="border rounded-lg p-8" style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-secondary)" }}>
            <div className="text-center mb-6">
              <svg className="mx-auto mb-3" width="48" height="48" viewBox="0 0 16 16" style={{ fill: "var(--accent)" }}>
                <path d="M16 8A8 8 0 110 8a8 8 0 0116 0zM8.5 4.5a.5.5 0 00-1 0v3h-3a.5.5 0 000 1h3v3a.5.5 0 001 0v-3h3a.5.5 0 000-1h-3v-3z" />
              </svg>
              <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Admin Panel</h1>
              <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                Connectez-vous pour gerer vos repositories
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm mb-1.5" style={{ color: "var(--text-secondary)" }}>
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Entrez le mot de passe admin"
                  className="w-full border rounded-md px-3 py-2 outline-none transition"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--border-color)",
                    color: "var(--text-primary)",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-color)")}
                  autoFocus
                />
              </div>
              {authError && (
                <p className="text-sm" style={{ color: "var(--danger)" }}>{authError}</p>
              )}
              <button
                type="submit"
                className="w-full text-white font-medium py-2 px-4 rounded-md transition"
                style={{ backgroundColor: "var(--btn-success)" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--btn-success-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--btn-success)")}
              >
                Se connecter
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Admin Panel</h1>
        <button
          onClick={() => {
            sessionStorage.removeItem("admin_token");
            setAuthenticated(false);
            setPassword("");
          }}
          className="text-sm transition"
          style={{ color: "var(--text-secondary)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--danger)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
        >
          Deconnexion
        </button>
      </div>

      <div className="border rounded-lg p-6 mb-8" style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-secondary)" }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
          Ajouter un repository
        </h2>
        <form onSubmit={handleAddRepo} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/owner/repo ou owner/repo"
            className="flex-1 border rounded-md px-3 py-2 outline-none text-sm transition"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--border-color)",
              color: "var(--text-primary)",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-color)")}
          />
          <button
            type="submit"
            disabled={loading}
            className="text-white font-medium py-2 px-6 rounded-md transition whitespace-nowrap text-sm disabled:opacity-50"
            style={{ backgroundColor: "var(--btn-success)" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--btn-success-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--btn-success)")}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                Ajout...
              </span>
            ) : (
              "Ajouter"
            )}
          </button>
        </form>

        {message && (
          <div
            className="mt-4 px-4 py-3 rounded-md text-sm border"
            style={{
              backgroundColor: message.type === "success" ? "var(--msg-success-bg)" : "var(--msg-error-bg)",
              borderColor: message.type === "success" ? "var(--msg-success-border)" : "var(--msg-error-border)",
              color: message.type === "success" ? "var(--success)" : "var(--danger)",
            }}
          >
            {message.text}
          </div>
        )}
      </div>

      <div className="border rounded-lg overflow-hidden" style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-secondary)" }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: "var(--border-color)" }}>
          <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            Repositories ({repos.length})
          </h2>
        </div>

        {repos.length === 0 ? (
          <div className="px-6 py-12 text-center" style={{ color: "var(--text-secondary)" }}>
            Aucun repository. Ajoutez-en un ci-dessus.
          </div>
        ) : (
          <div>
            {repos.map((repo, idx) => (
              <div
                key={repo.id}
                className="px-6 py-4 flex items-center justify-between gap-4"
                style={{
                  borderTop: idx > 0 ? "1px solid var(--border-color)" : undefined,
                }}
              >
                <div className="min-w-0 flex-1">
                  <a
                    href={`/repo/${repo.owner}/${repo.name}`}
                    className="hover:underline font-medium text-sm"
                    style={{ color: "var(--accent)" }}
                  >
                    {repo.fullName}
                  </a>
                  <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: "var(--text-secondary)" }}>
                    <span>{repo.language}</span>
                    <span>Ajoute le {new Date(repo.addedAt).toLocaleDateString("fr-FR")}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteRepo(repo.id, repo.fullName)}
                  className="transition p-2"
                  style={{ color: "var(--text-secondary)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--danger)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
                  title="Supprimer"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M6.5 1.75a.25.25 0 01.25-.25h2.5a.25.25 0 01.25.25V3h-3V1.75zm4.5 0V3h2.25a.75.75 0 010 1.5H2.75a.75.75 0 010-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75zM4.496 6.675a.75.75 0 10-1.492.15l.66 6.6A1.75 1.75 0 005.405 15h5.19c.9 0 1.652-.681 1.741-1.576l.66-6.6a.75.75 0 00-1.492-.149l-.66 6.6a.25.25 0 01-.249.225h-5.19a.25.25 0 01-.249-.225l-.66-6.6z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
