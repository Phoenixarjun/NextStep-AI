"use client";
import React from "react";
import { FiCheck, FiAlertTriangle, FiInfo, FiExternalLink } from "react-icons/fi";

interface AnalysisResult {
  name: string;
  email: string;
  phone: string;
  target_domain: string;
  job_type: string;
  message: string;
  suggestions: string[];
  recommended_keywords: string[];
  short_learnings: string[];
  tricks_and_strategies: string[];
  focus_areas: string[];
}

export default function InterviewResults({ results }: { results: any }) {
  // Extract and parse the JSON content
  const parseResults = () => {
    try {
      const content = results?.suggestions?.content;
      if (!content) return null;
      
      const jsonStart = content.indexOf('{');
      const jsonEnd = content.lastIndexOf('}') + 1;
      const jsonString = content.slice(jsonStart, jsonEnd);
      return JSON.parse(jsonString) as AnalysisResult;
    } catch (error) {
      console.error("Error parsing results:", error);
      return null;
    }
  };

  const analysis = parseResults();
  if (!analysis) return <div className="text-center py-12 text-gray-400">No analysis results available</div>;

  // Status styling based on message
  const getStatusStyle = (message: string) => {
    const msg = message.toLowerCase();
    if (msg.includes("highly suitable")) {
      return "bg-green-500/10 text-green-400";
    }
    if (msg.includes("partially suitable")) {
      return "bg-yellow-500/10 text-yellow-400";
    }
    return "bg-red-500/10 text-red-400";
  };

  return (
    <section className="py-8 px-4">
      <div className="container mx-auto max-w-4xl bg-gray-800/50 border border-gray-700 rounded-xl shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="p-6 bg-gray-900/50 border-b border-gray-700">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Interview Analysis Results</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(analysis.message)} flex items-center gap-1`}>
                  {analysis.message.includes("Highly") ? <FiCheck /> : 
                   analysis.message.includes("Partially") ? <FiInfo /> : <FiAlertTriangle />}
                  {analysis.message}
                </span>
                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm">
                  {analysis.job_type}
                </span>
                <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-sm">
                  {analysis.target_domain}
                </span>
              </div>
            </div>
            <div className="text-right">
              <h3 className="text-xl font-semibold text-white">{analysis.name}</h3>
              <p className="text-gray-400">{analysis.email}</p>
              <p className="text-gray-400">{analysis.phone}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-8">
          {/* Key Suggestions */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FiInfo className="text-yellow-400" />
              Key Suggestions
            </h3>
            <ul className="space-y-3">
              {analysis.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-3 p-3 bg-gray-700/30 rounded-lg border border-gray-700">
                  <span className="text-yellow-400">{index + 1}.</span>
                  <p className="text-gray-300">{suggestion}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommended Keywords */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FiExternalLink className="text-blue-400" />
              Recommended Keywords
            </h3>
            <div className="flex flex-wrap gap-2">
              {analysis.recommended_keywords.map((keyword, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm border border-blue-500/30"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* Focus Areas */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FiAlertTriangle className="text-red-400" />
              Focus Areas
            </h3>
            <ul className="space-y-2">
              {analysis.focus_areas.map((area, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-300">
                  <span className="text-red-400">•</span>
                  {area}
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Learnings */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FiCheck className="text-green-400" />
              Quick Learnings
            </h3>
            <ul className="space-y-2">
              {analysis.short_learnings.map((learning, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-300">
                  <span className="text-green-400">•</span>
                  {learning}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}