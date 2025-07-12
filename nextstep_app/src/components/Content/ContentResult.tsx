"use client";

import { useState, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { FiCopy, FiCheck } from "react-icons/fi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { marked } from "marked";
import DOMPurify from "dompurify";
// import { sanitize } from "isomorphic-dompurify";

interface ContentResultProps {
  result: string;
  contentType: "github" | "linkedin" | "twitter" | "other";
}

// Configure marked.js
marked.setOptions({
  breaks: true,
  gfm: true,
});

export default function ContentResult({ result, contentType }: ContentResultProps) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLDivElement>(null);

  // Convert markdown to sanitized HTML
  const sanitizedHTML = useMemo(() => {
    try {
      const rawHTML = marked.parse(result || "", { async: false }) as string;
      return DOMPurify.sanitize(rawHTML, {
        ALLOWED_TAGS: [
          'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
          'p', 'br', 'em', 'strong', 'blockquote', 'code',
          'pre', 'ul', 'ol', 'li', 'a', 'img', 'div',
          'span', 'hr', 'table', 'thead', 'tbody', 'tr',
          'th', 'td', 'del', 'ins', 'sub', 'sup'
        ],
        ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'target', 'rel'],
      });
    } catch (error) {
      console.error("Error parsing markdown:", error);
      return "";
    }
  }, [result]);

  // Convert markdown to JSX components
  const markdownToJSX = useMemo(() => {
    if (!result) return null;
    
    // Simple markdown to JSX conversion (you can extend this as needed)
    const lines = result.split('\n');
    return lines.map((line, i) => {
      if (line.startsWith('# ')) {
        return <h1 key={i} className="text-3xl font-bold my-4">{line.substring(2)}</h1>;
      } else if (line.startsWith('## ')) {
        return <h2 key={i} className="text-2xl font-bold my-3">{line.substring(3)}</h2>;
      } else if (line.startsWith('### ')) {
        return <h3 key={i} className="text-xl font-bold my-2">{line.substring(4)}</h3>;
      } else if (line.startsWith('#### ')) {
        return <h4 key={i} className="text-lg font-bold my-2">{line.substring(5)}</h4>;
      } else if (line.startsWith('- ')) {
        return <li key={i} className="ml-6 list-disc">{line.substring(2)}</li>;
      } else if (line.startsWith('> ')) {
        return <blockquote key={i} className="border-l-4 border-gray-500 pl-4 my-2 italic">{line.substring(2)}</blockquote>;
      } else if (line.trim() === '') {
        return <br key={i} />;
      } else if (line.match(/^\[.*\]\(.*\)$/)) {
        const match = line.match(/\[(.*?)\]\((.*?)\)/);
        if (match) {
          return (
            <a key={i} href={match[2]} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
              {match[1]}
            </a>
          );
        }
      } else if (line.match(/^\!\[.*\]\(.*\)$/)) {
        const match = line.match(/\!\[(.*?)\]\((.*?)\)/);
        if (match) {
          return (
            <img key={i} src={match[2]} alt={match[1]} className="my-4 max-w-full rounded-lg" />
          );
        }
      } else if (line.match(/^\`\`\`/)) {
        // Handle code blocks (simplified)
        const langMatch = line.match(/^\`\`\`(\w+)/);
        const language = langMatch ? langMatch[1] : '';
        const codeContent = lines.slice(i + 1).join('\n').split('```')[0];

      } else {
        return <p key={i} className="my-2 text-gray-300">{line}</p>;
      }
      return null;
    });
  }, [result]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative bg-gray-900/50 border border-gray-700 rounded-xl overflow-hidden shadow-lg mt-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center bg-gray-800/70 px-4 py-3 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="text-sm text-gray-400 uppercase font-mono">
          {contentType === "github" ? "README Preview" : `${contentType} Content`}
        </div>
        <button
          onClick={copyToClipboard}
          className="flex items-center space-x-1 text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-md transition-colors"
          aria-label="Copy to clipboard"
        >
          {copied ? (
            <>
              <FiCheck className="text-green-400" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <FiCopy />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Body */}
      <div className="overflow-auto max-h-[70vh] p-4" ref={codeRef}>
        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md bg-gray-800/50 rounded-lg p-1 mb-4">
            <TabsTrigger
              value="preview"
              className="py-1 px-3 rounded-md text-sm data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300 transition-colors"
            >
              Preview
            </TabsTrigger>
            <TabsTrigger
              value="raw"
              className="py-1 px-3 rounded-md text-sm data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300 transition-colors"
            >
              Raw Markdown
            </TabsTrigger>
          </TabsList>


          <TabsContent value="preview">
            <div className="space-y-4">
              {markdownToJSX}
            </div>
          </TabsContent>

          <TabsContent value="raw">
            <pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono bg-gray-800/50 p-4 rounded-lg">
              {result}
            </pre>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
}