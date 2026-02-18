"use client";

import { useMemo } from "react";
import hljs from "highlight.js";

interface CodeViewerProps {
  code: string;
  filename: string;
}

function getLanguageFromFilename(filename: string): string | undefined {
  const ext = filename.split(".").pop()?.toLowerCase();
  const map: Record<string, string> = {
    ts: "typescript", tsx: "typescript", js: "javascript", jsx: "javascript",
    py: "python", rb: "ruby", go: "go", rs: "rust", java: "java",
    kt: "kotlin", swift: "swift", c: "c", cpp: "cpp", h: "c", hpp: "cpp",
    cs: "csharp", php: "php", html: "html", css: "css", scss: "scss",
    less: "less", json: "json", yaml: "yaml", yml: "yaml", xml: "xml",
    md: "markdown", sql: "sql", sh: "bash", bash: "bash", zsh: "bash",
    dockerfile: "dockerfile", makefile: "makefile", toml: "toml",
    ini: "ini", vue: "html", svelte: "html", r: "r", dart: "dart",
    lua: "lua", perl: "perl", ex: "elixir", exs: "elixir",
    erl: "erlang", hs: "haskell", clj: "clojure", scala: "scala", tf: "hcl",
  };
  return ext ? map[ext] : undefined;
}

export default function CodeViewer({ code, filename }: CodeViewerProps) {
  const language = getLanguageFromFilename(filename);

  const highlightedLines = useMemo(() => {
    let highlighted: string;
    try {
      if (language) {
        highlighted = hljs.highlight(code, { language }).value;
      } else {
        highlighted = hljs.highlightAuto(code).value;
      }
    } catch {
      highlighted = code
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }
    return highlighted.split("\n");
  }, [code, language]);

  return (
    <div className="border rounded-lg overflow-hidden" style={{ borderColor: "var(--border-color)" }}>
      <div className="border-b px-4 py-2 flex items-center justify-between" style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)" }}>
        <span className="text-sm font-mono" style={{ color: "var(--text-primary)" }}>{filename}</span>
        <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{highlightedLines.length} lines</span>
      </div>

      <div className="overflow-x-auto" style={{ backgroundColor: "var(--code-bg)" }}>
        <table className="w-full text-[13px] font-mono leading-[1.5]">
          <tbody>
            {highlightedLines.map((line, i) => (
              <tr key={i} className="hover:opacity-90" style={{ ["--tw-bg-opacity" as string]: 1 }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-hover)")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
                <td className="text-right select-none pl-4 pr-3 w-[1%] whitespace-nowrap align-top" style={{ color: "var(--text-tertiary)" }}>
                  {i + 1}
                </td>
                <td
                  className="px-4 whitespace-pre overflow-visible"
                  dangerouslySetInnerHTML={{ __html: line || " " }}
                />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
