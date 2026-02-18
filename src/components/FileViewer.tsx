"use client";

import { useState, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import hljs from "highlight.js";

interface FileViewerProps {
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

function getFileType(filename: string): "markdown" | "html" | "notebook" | "code" {
  const lower = filename.toLowerCase();
  if (lower.endsWith(".md") || lower.endsWith(".mdx")) return "markdown";
  if (lower.endsWith(".html") || lower.endsWith(".htm")) return "html";
  if (lower.endsWith(".ipynb")) return "notebook";
  return "code";
}

interface NotebookCell {
  cell_type: "code" | "markdown" | "raw";
  source: string[];
  outputs?: Array<{
    output_type: string;
    text?: string[];
    data?: Record<string, string[]>;
    traceback?: string[];
  }>;
  execution_count?: number | null;
}

function NotebookRenderer({ code }: { code: string }) {
  const notebook = useMemo(() => {
    try {
      return JSON.parse(code);
    } catch {
      return null;
    }
  }, [code]);

  if (!notebook || !notebook.cells) {
    return <div className="p-6" style={{ color: "var(--text-secondary)" }}>Impossible de parser ce notebook.</div>;
  }

  const kernelName = notebook.metadata?.kernelspec?.display_name || notebook.metadata?.kernelspec?.name || "Unknown";

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-2 mb-4 text-xs" style={{ color: "var(--text-tertiary)" }}>
        <span className="px-2 py-1 rounded-md" style={{ backgroundColor: "var(--accent-subtle)", color: "var(--accent)" }}>
          Kernel: {kernelName}
        </span>
        <span>{notebook.cells.length} cells</span>
      </div>
      {notebook.cells.map((cell: NotebookCell, i: number) => (
        <div key={i} className="notebook-cell">
          <div className="notebook-cell-header flex items-center gap-2">
            <span>{cell.cell_type === "code" ? "Code" : cell.cell_type === "markdown" ? "Markdown" : "Raw"}</span>
            {cell.cell_type === "code" && cell.execution_count != null && (
              <span style={{ color: "var(--accent)" }}>[{cell.execution_count}]</span>
            )}
          </div>
          <div className="notebook-cell-content">
            {cell.cell_type === "markdown" ? (
              <div className="markdown-body" style={{ color: "var(--text-primary)" }}>
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                  {cell.source.join("")}
                </ReactMarkdown>
              </div>
            ) : (
              <pre className="text-[13px] font-mono overflow-x-auto" style={{ color: "var(--text-primary)", margin: 0 }}>
                <code>{cell.source.join("")}</code>
              </pre>
            )}
          </div>
          {cell.outputs && cell.outputs.length > 0 && (
            <div className="notebook-output">
              {cell.outputs.map((out, j) => {
                if (out.text) {
                  return <pre key={j}>{out.text.join("")}</pre>;
                }
                if (out.data) {
                  if (out.data["text/html"]) {
                    return <div key={j} dangerouslySetInnerHTML={{ __html: out.data["text/html"].join("") }} />;
                  }
                  if (out.data["image/png"]) {
                    return <img key={j} src={`data:image/png;base64,${out.data["image/png"].join("")}`} alt="output" className="max-w-full" />;
                  }
                  if (out.data["text/plain"]) {
                    return <pre key={j}>{out.data["text/plain"].join("")}</pre>;
                  }
                }
                if (out.traceback) {
                  return <pre key={j} style={{ color: "var(--danger)" }}>{out.traceback.join("\n").replace(/\x1b\[[0-9;]*m/g, "")}</pre>;
                }
                return null;
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function HtmlPreview({ code }: { code: string }) {
  return (
    <iframe
      srcDoc={code}
      className="w-full border-0 rounded-b-lg"
      style={{ minHeight: "500px", backgroundColor: "#fff" }}
      sandbox="allow-scripts allow-same-origin"
      title="HTML Preview"
    />
  );
}

function MarkdownPreview({ code }: { code: string }) {
  return (
    <div className="markdown-body p-6 sm:p-8" style={{ color: "var(--text-primary)" }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
      >
        {code}
      </ReactMarkdown>
    </div>
  );
}

function CodeView({ code, filename }: { code: string; filename: string }) {
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
      highlighted = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
    return highlighted.split("\n");
  }, [code, language]);

  return (
    <div className="overflow-x-auto" style={{ backgroundColor: "var(--code-bg)" }}>
      <table className="w-full text-[13px] font-mono leading-[1.6]">
        <tbody>
          {highlightedLines.map((line, i) => (
            <tr
              key={i}
              className="transition-colors"
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <td className="text-right select-none pl-4 pr-3 w-[1%] whitespace-nowrap align-top" style={{ color: "var(--text-tertiary)" }}>{i + 1}</td>
              <td className="px-4 whitespace-pre overflow-visible" dangerouslySetInnerHTML={{ __html: line || " " }} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function FileViewer({ code, filename }: FileViewerProps) {
  const fileType = getFileType(filename);
  const hasPreview = fileType !== "code";
  const [mode, setMode] = useState<"preview" | "code">(hasPreview ? "preview" : "code");
  const lines = code.split("\n");

  return (
    <div className="rounded-xl overflow-hidden animate-fadeInUp" style={{ boxShadow: "var(--shadow-card)", backgroundColor: "var(--bg-card)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)" }}>
        <div className="flex items-center gap-2.5">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{ color: "var(--icon-color)" }}>
            <path d="M3.75 1.5a.25.25 0 00-.25.25v11.5c0 .138.112.25.25.25h8.5a.25.25 0 00.25-.25V6H9.75A1.75 1.75 0 018 4.25V1.5H3.75zm5.75.56v2.19c0 .138.112.25.25.25h2.19L9.5 2.06zM2 1.75C2 .784 2.784 0 3.75 0h5.086c.464 0 .909.184 1.237.513l3.414 3.414c.329.328.513.773.513 1.237v8.086A1.75 1.75 0 0112.25 15h-8.5A1.75 1.75 0 012 13.25V1.75z" />
          </svg>
          <span className="text-sm font-mono font-medium" style={{ color: "var(--text-primary)" }}>{filename}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs hidden sm:inline" style={{ color: "var(--text-tertiary)" }}>{lines.length} lines</span>
          {hasPreview && (
            <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: "var(--border-color)" }}>
              <button
                onClick={() => setMode("preview")}
                className="px-3 py-1 text-xs font-medium transition-colors"
                style={{
                  backgroundColor: mode === "preview" ? "var(--accent-subtle)" : "transparent",
                  color: mode === "preview" ? "var(--accent)" : "var(--text-secondary)",
                }}
              >
                Preview
              </button>
              <button
                onClick={() => setMode("code")}
                className="px-3 py-1 text-xs font-medium transition-colors border-l"
                style={{
                  borderColor: "var(--border-color)",
                  backgroundColor: mode === "code" ? "var(--accent-subtle)" : "transparent",
                  color: mode === "code" ? "var(--accent)" : "var(--text-secondary)",
                }}
              >
                Code
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      {mode === "preview" && fileType === "markdown" && <MarkdownPreview code={code} />}
      {mode === "preview" && fileType === "html" && <HtmlPreview code={code} />}
      {mode === "preview" && fileType === "notebook" && <NotebookRenderer code={code} />}
      {mode === "code" && <CodeView code={code} filename={filename} />}
    </div>
  );
}
