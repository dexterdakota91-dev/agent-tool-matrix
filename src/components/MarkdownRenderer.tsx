"use client";

import * as React from "react";
import DOMPurify from "isomorphic-dompurify";
import { Check, Copy } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
}


function CodeBlock({ codeLines, codeLanguage }: { codeLines: string[], codeLanguage: string }) {
  const [isCopied, setIsCopied] = React.useState(false);
  const codeString = codeLines.join("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="relative group my-3">
      <button
        onClick={handleCopy}
        className="absolute right-2 top-2 p-1.5 rounded-md bg-black/50 text-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity hover:text-foreground hover:bg-black/70"
        aria-label="Copy code"
      >
        {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
      </button>
      <pre className="bg-black/25 dark:bg-black/50 border border-white/10 rounded-lg p-4 font-mono text-xs overflow-x-auto text-emerald-400">
        <code className={codeLanguage}>{codeString}</code>
      </pre>
    </div>
  );
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content) return null;

  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeLines: string[] = [];
  let codeLanguage = "";
  let listItems: string[] = [];

  const flushList = (key: number) => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${key}`} className="list-disc pl-5 my-3 space-y-1 text-sm text-foreground/80">
          {listItems.map((item, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(item) }} />
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  const parseInlineMarkdown = (text: string): string => {
    // Escape simple HTML characters first
    let html = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Bold (**text**)
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong class='font-bold text-foreground'>$1</strong>");

    // Inline code (`code`)
    html = html.replace(/`(.*?)`/g, "<code class='bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded font-mono text-xs text-pink-500'>$1</code>");

    // Links ([text](url))
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, "<a href='$2' target='_blank' rel='noopener noreferrer' class='text-blue-500 hover:underline'>$1</a>");

    return DOMPurify.sanitize(html, { ADD_ATTR: ['target'] });
  };

  lines.forEach((line, idx) => {
    // Handle code block toggle
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        // End code block
        elements.push(
          <CodeBlock key={`code-${idx}`} codeLines={codeLines} codeLanguage={codeLanguage} />
        );
        codeLines = [];
        inCodeBlock = false;
      } else {
        // Start code block
        flushList(idx);
        codeLanguage = line.trim().substring(3).trim();
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      return;
    }

    const trimmed = line.trim();

    // Headers
    if (trimmed.startsWith("### ")) {
      flushList(idx);
      elements.push(
        <h3 key={idx} className="text-lg font-bold text-foreground mt-4 mb-2 border-b border-white/5 pb-1">
          {trimmed.substring(4)}
        </h3>
      );
    } else if (trimmed.startsWith("#### ")) {
      flushList(idx);
      elements.push(
        <h4 key={idx} className="text-base font-semibold text-foreground mt-3 mb-1">
          {trimmed.substring(5)}
        </h4>
      );
    } else if (trimmed.startsWith("## ")) {
      flushList(idx);
      elements.push(
        <h2 key={idx} className="text-xl font-bold text-foreground mt-5 mb-3 border-b border-white/10 pb-1">
          {trimmed.substring(3)}
        </h2>
      );
    }
    // List items
    else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      listItems.push(trimmed.substring(2));
    }
    // Paragraph or empty
    else {
      flushList(idx);
      if (trimmed) {
        elements.push(
          <p
            key={idx}
            className="text-sm text-foreground/80 leading-relaxed my-2"
            dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(trimmed) }}
          />
        );
      }
    }
  });

  // Flush any remaining lists
  flushList(lines.length);

  return <div className="space-y-1 font-sans">{elements}</div>;
}