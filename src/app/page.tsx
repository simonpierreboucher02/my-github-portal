"use client";

import { useEffect, useState, useMemo } from "react";
import RepoCard from "@/components/RepoCard";

interface Repo {
  id: string;
  owner: string;
  name: string;
  fullName: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
}

export default function HomePage() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [langFilter, setLangFilter] = useState("all");

  useEffect(() => {
    fetch("/api/repos")
      .then((res) => res.json())
      .then((data) => {
        setRepos(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const languages = useMemo(() => {
    const langs = new Set(repos.map((r) => r.language).filter(Boolean));
    return Array.from(langs).sort();
  }, [repos]);

  const filtered = repos.filter((r) => {
    const matchesSearch =
      r.fullName.toLowerCase().includes(search.toLowerCase()) ||
      r.description?.toLowerCase().includes(search.toLowerCase()) ||
      r.language?.toLowerCase().includes(search.toLowerCase());
    const matchesLang = langFilter === "all" || r.language === langFilter;
    return matchesSearch && matchesLang;
  });

  const totalStars = repos.reduce((a, r) => a + r.stars, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Hero */}
      <div className="text-center mb-10 sm:mb-14 animate-fadeInUp">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-5" style={{ backgroundColor: "var(--accent-subtle)", color: "var(--accent)" }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>
          Portfolio de code open source
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight" style={{ backgroundImage: "linear-gradient(135deg, var(--gradient-start), var(--gradient-end))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
          SPBoucher GitHub
        </h1>
        <p className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          Explorez mes repositories avec coloration syntaxique, historique des commits, rendu Markdown et plus encore.
        </p>

        {/* Stats */}
        {!loading && repos.length > 0 && (
          <div className="flex items-center justify-center gap-8 mt-8">
            {[
              { label: "Repositories", value: repos.length },
              { label: "Languages", value: languages.length },
              { label: "Stars", value: totalStars },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold" style={{ color: "var(--text-primary)" }}>{stat.value}</div>
                <div className="text-xs mt-0.5 font-medium" style={{ color: "var(--text-tertiary)" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Search + filters */}
      <div className="max-w-2xl mx-auto mb-8 animate-fadeInUp" style={{ animationDelay: "0.1s" }}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2" width="18" height="18" viewBox="0 0 20 20" fill="currentColor" style={{ color: "var(--text-tertiary)" }}>
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            <input
              type="text"
              placeholder="Rechercher un repository..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl pl-10 pr-4 py-3 border outline-none transition-all text-sm"
              style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)", color: "var(--text-primary)", boxShadow: "var(--shadow-card)" }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.boxShadow = "var(--shadow-card-hover)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border-color)"; e.currentTarget.style.boxShadow = "var(--shadow-card)"; }}
            />
          </div>
          <select
            value={langFilter}
            onChange={(e) => setLangFilter(e.target.value)}
            className="rounded-xl px-4 py-3 border outline-none text-sm cursor-pointer"
            style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)", color: "var(--text-primary)", boxShadow: "var(--shadow-card)" }}
          >
            <option value="all">Tous les langages</option>
            {languages.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-5" style={{ animationDelay: "0.15s" }}>
        <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
          {filtered.length} repositor{filtered.length !== 1 ? "ies" : "y"}
          {langFilter !== "all" && <span> en <span style={{ color: "var(--accent)" }}>{langFilter}</span></span>}
        </span>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-[3px]" style={{ borderColor: "var(--spinner-track)", borderTopColor: "var(--spinner-fill)" }} />
          <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>Chargement des repositories...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: "var(--accent-subtle)" }}>
            <svg width="28" height="28" viewBox="0 0 16 16" fill="currentColor" style={{ color: "var(--accent)" }}>
              <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1h-8a1 1 0 00-1 1v6.708A2.486 2.486 0 014.5 9h8.5V1.5zm-8 11h8v1.5H4.5a1 1 0 01-1-1z" />
            </svg>
          </div>
          <p className="text-base font-medium" style={{ color: "var(--text-primary)" }}>
            {repos.length === 0 ? "Aucun repository" : "Aucun resultat"}
          </p>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            {repos.length === 0 ? "Ajoutez des repos via le panneau Admin." : "Essayez un autre terme de recherche."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((repo, i) => (
            <div key={repo.id} className="animate-fadeInUp" style={{ animationDelay: `${Math.min(i * 0.03, 0.5)}s` }}>
              <RepoCard
                owner={repo.owner}
                name={repo.name}
                description={repo.description}
                language={repo.language}
                stars={repo.stars}
                forks={repo.forks}
              />
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t text-center" style={{ borderColor: "var(--border-color)" }}>
        <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
          SPBoucher GitHub Portal &middot; Propulse par Next.js &middot; Donnees via GitHub API
        </p>
      </footer>
    </div>
  );
}
