import Link from "next/link";

interface RepoCardProps {
  owner: string;
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6", JavaScript: "#f1e05a", Python: "#3572A5",
  Java: "#b07219", Go: "#00ADD8", Rust: "#dea584", "C++": "#f34b7d",
  C: "#555555", Ruby: "#701516", PHP: "#4F5D95", Swift: "#F05138",
  Kotlin: "#A97BFF", Dart: "#00B4AB", Shell: "#89e051", HTML: "#e34c26",
  CSS: "#563d7c", Vue: "#41b883", Svelte: "#ff3e00", R: "#198CE7",
  TeX: "#3D6117", "Jupyter Notebook": "#DA5B0B", Unknown: "#8b949e",
};

export default function RepoCard({ owner, name, description, language, stars, forks }: RepoCardProps) {
  const langColor = LANG_COLORS[language] || LANG_COLORS["Unknown"];

  return (
    <Link href={`/repo/${owner}/${name}`}>
      <div
        className="rounded-xl p-5 transition-all duration-300 cursor-pointer group h-full flex flex-col"
        style={{
          backgroundColor: "var(--bg-card)",
          boxShadow: "var(--shadow-card)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "var(--shadow-card-hover)";
          e.currentTarget.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "var(--shadow-card)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        <div className="flex items-start gap-3 mb-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "var(--accent-subtle)" }}>
            <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" style={{ color: "var(--accent)" }}>
              <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1h-8a1 1 0 00-1 1v6.708A2.486 2.486 0 014.5 9h8.5V1.5zm-8 11h8v1.5H4.5a1 1 0 01-1-1z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-[15px] group-hover:underline truncate" style={{ color: "var(--accent)" }}>
              {name}
            </h3>
            <p className="text-xs mt-0.5 truncate" style={{ color: "var(--text-tertiary)" }}>{owner}</p>
          </div>
        </div>

        {description && (
          <p className="text-[13px] leading-relaxed line-clamp-2 flex-1 mb-4" style={{ color: "var(--text-secondary)" }}>
            {description}
          </p>
        )}
        {!description && <div className="flex-1" />}

        <div className="flex items-center gap-4 pt-3 text-xs border-t" style={{ color: "var(--text-secondary)", borderColor: "var(--border-color)" }}>
          {language && language !== "Unknown" && (
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full inline-block ring-1 ring-black/10" style={{ backgroundColor: langColor }} />
              {language}
            </span>
          )}
          <span className="flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" /></svg>
            {stars}
          </span>
          <span className="flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z" /></svg>
            {forks}
          </span>
        </div>
      </div>
    </Link>
  );
}
