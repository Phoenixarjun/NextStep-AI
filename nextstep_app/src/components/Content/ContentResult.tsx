"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FiCopy, FiCheck } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@radix-ui/react-tabs";

interface ContentResultProps {
  result: string;
  contentType: "github" | "linkedin" | "twitter" | "other";
}

export default function ContentResult({ result, contentType }: ContentResultProps) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLDivElement>(null);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const githubMarkdownClasses = `
    prose prose-invert max-w-none
    prose-headings:text-gray-100 prose-headings:font-semibold
    prose-p:text-gray-300 prose-a:text-blue-400 prose-a:underline
    prose-strong:text-white prose-em:text-gray-300
    prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
    prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-700 prose-pre:rounded-lg
    prose-img:rounded-lg
  `;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative bg-gray-900/50 border border-gray-700 rounded-xl overflow-hidden shadow-lg mt-6"
    >
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

      <div className="overflow-auto max-h-[70vh] p-4" ref={codeRef}>
        {contentType === "github" ? (
          <Tabs defaultValue="preview" className="w-full">
            <TabsList className="grid grid-cols-2 w-full max-w-xs bg-gray-800/50 rounded-lg p-1 mb-4">
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

            <TabsContent value="preview" className="mt-0">
              <div className={githubMarkdownClasses}>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    code(props: React.ComponentProps<'code'> & { inline?: boolean }) {
                      const { inline, className, children, ...rest } = props;
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <div className="relative">
                          <div className="absolute top-0 right-0 bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-bl rounded-tr">
                            {match[1]}
                          </div>
                          <code className={className} {...rest}>
                            {children}
                          </code>
                        </div>
                      ) : (
                        <code className={className} {...rest}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {result}
                </ReactMarkdown>
              </div>
            </TabsContent>

            <TabsContent value="raw">
              <pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono bg-gray-800/50 p-4 rounded-lg">
                {result}
              </pre>
            </TabsContent>
          </Tabs>
        ) : (
          <pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono bg-gray-800/50 p-4 rounded-lg">
            {result}
          </pre>
        )}
      </div>
    </motion.div>
  );
}
