"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FiChevronDown, FiChevronUp, FiCopy, FiCheck } from "react-icons/fi";

interface Question {
  question: string;
  answer: string;
}

interface QuestionCategory {
  [key: string]: Question[];
}

interface InterviewData {
  job_role: string;
  questions_with_answers: QuestionCategory;
}

export default function CandidateResult({ results }: { results: any }) {
  const parseResults = (data: any): InterviewData | null => {
    try {
      if (typeof data?.questions?.content === "string") {
        const jsonStart = data.questions.content.indexOf("{");
        const jsonEnd = data.questions.content.lastIndexOf("}") + 1;
        const jsonString = data.questions.content.slice(jsonStart, jsonEnd);
        return JSON.parse(jsonString);
      }
      return null;
    } catch (error) {
      console.error("Error parsing interview results:", error);
      return null;
    }
  };

  const parsedResults = parseResults(results);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<{ category: string; index: number } | null>(null);

  if (!parsedResults) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center p-12"
      >
        <div className="text-center text-gray-400">
          <p>Could not parse the interview results. Please try again.</p>
        </div>
      </motion.div>
    );
  }

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const copyToClipboard = (text: string, category: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex({ category, index });
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const categoryMetadata = {
    personal: { label: "Personal Questions", color: "bg-blue-500/10 text-blue-400", icon: "👤" },
    resume: { label: "Resume-Based Questions", color: "bg-purple-500/10 text-purple-400", icon: "📄" },
    technical: { label: "Technical Questions", color: "bg-green-500/10 text-green-400", icon: "⚙️" },
    coding: { label: "Coding Questions", color: "bg-yellow-500/10 text-yellow-400", icon: "💻" },
    logical: { label: "Problem-Solving Questions", color: "bg-red-500/10 text-red-400", icon: "🧩" },
    behavioral: { label: "Behavioral Questions", color: "bg-indigo-500/10 text-indigo-400", icon: "🗣️" },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800/70 backdrop-blur-lg border border-gray-700 rounded-2xl overflow-hidden shadow-2xl shadow-black/50"
        >
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="p-8 bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Interview Q&A for <span className="text-teal-400">{parsedResults.job_role}</span>
            </h1>
            <p className="text-gray-400 text-lg">
              {Object.keys(parsedResults.questions_with_answers).length} categories,{" "}
              {Object.values(parsedResults.questions_with_answers).reduce((acc, cur) => acc + cur.length, 0)}{" "}
              questions total
            </p>
          </motion.div>

          {/* Categories */}
          <div className="divide-y divide-gray-700/50">
            {Object.entries(parsedResults.questions_with_answers).map(([category, questions]) => {
              const meta = categoryMetadata[category as keyof typeof categoryMetadata] || 
                          { label: category, color: "bg-gray-500/10 text-gray-400", icon: "❓" };
              const isExpanded = expandedCategories.includes(category);

              return (
                <div key={category} className="group">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => toggleCategory(category)}
                    className={`w-full flex items-center justify-between p-6 text-left transition-all duration-300 ${isExpanded ? 'bg-gray-700/20' : 'hover:bg-gray-700/10'}`}
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl">{meta.icon}</span>
                      <div>
                        <h2 className="text-xl font-semibold text-white">
                          {meta.label}
                        </h2>
                        <p className="text-sm text-gray-400">{questions.length} questions</p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      className={`p-2 rounded-full ${meta.color}`}
                    >
                      <FiChevronDown className="text-xl" />
                    </motion.div>
                  </motion.button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ 
                          opacity: 1, 
                          height: "auto",
                          transition: { 
                            opacity: { duration: 0.3 },
                            height: { duration: 0.4 }
                          }
                        }}
                        exit={{ 
                          opacity: 0, 
                          height: 0,
                          transition: { 
                            opacity: { duration: 0.2 },
                            height: { duration: 0.3 }
                          }
                        }}
                        className="px-6 pb-6 space-y-4 py-6"
                      >
                        {questions.map((q, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ 
                              opacity: 1, 
                              y: 0,
                              transition: { delay: index * 0.05 }
                            }}
                            whileHover={{ scale: 1.01 }}
                            className="bg-gray-900/50 rounded-xl border border-gray-700 overflow-hidden shadow-lg"
                          >
                            <div className="p-5">
                              <div className="flex items-start gap-3">
                                <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center ${meta.color} text-xs font-bold`}>
                                  {index + 1}
                                </div>
                                <h3 className="text-lg font-medium text-white flex-1">{q.question}</h3>
                              </div>
                              
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ 
                                  height: "auto", 
                                  opacity: 1,
                                  transition: { delay: 0.2 }
                                }}
                                className="mt-4"
                              >
                                <div className="relative p-4 bg-gray-800/70 rounded-lg border border-gray-700">
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => copyToClipboard(q.answer, category, index)}
                                    className="absolute top-3 right-3 p-1.5 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                                    title="Copy answer"
                                  >
                                    {copiedIndex?.category === category && copiedIndex?.index === index ? (
                                      <FiCheck className="text-green-400" />
                                    ) : (
                                      <FiCopy className="text-gray-300 hover:text-white" />
                                    )}
                                  </motion.button>
                                  <p className="text-gray-300 whitespace-pre-line pr-8">{q.answer}</p>
                                </div>
                              </motion.div>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="p-6 bg-gray-900/70 border-t border-gray-700 text-center"
          >
            <p className="text-gray-400 text-sm">
              Use these questions to sharpen your preparation. You've got this!{" "}
              <span className="text-teal-400">🚀</span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}