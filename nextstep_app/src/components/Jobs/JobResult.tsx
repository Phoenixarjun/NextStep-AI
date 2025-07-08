"use client";
import React from "react";
import { motion } from "framer-motion";
import { FiExternalLink, FiAlertTriangle, FiInfo, FiStar, FiCheck } from "react-icons/fi";

interface JobMatch {
  job_title: string;
  company: string;
  location: string;
  fit_score: number;
  fit_message: string;
  improvements: string[];
  interview_tips: string[];
  company_insights: string;
  job_url: string;
  reasons: string[];
}

interface JobResultProps {
  results: {
    job_matches?: JobMatch[];
    message?: string;
  };
}

export default function JobResult({ results }: JobResultProps) {
  if (!results?.job_matches || results.job_matches.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        {results?.message || "No job matches found. Try adjusting your preferences."}
      </div>
    );
  }

  const getFitScoreTheme = (score: number) => {
    if (score >= 80) return "bg-green-500/10 text-green-400";
    if (score >= 60) return "bg-yellow-500/10 text-yellow-400";
    return "bg-red-500/10 text-red-400";
  };

  // Animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
      },
    }),
  };

  return (
    <section className="py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <h2 className="text-3xl font-bold text-white mb-2">
            Your Top Job Matches
          </h2>
          {results.message && (
            <p className="text-gray-400 mb-6">{results.message}</p>
          )}

          {results.job_matches.map((match, index) => (
            <motion.div
              key={`${match.company}-${match.job_title}-${index}`}
              custom={index}
              variants={cardVariants}
              className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 shadow-lg"
            >
              {/* Job Header */}
              <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {match.job_title}
                  </h3>
                  <p className="text-gray-300">{match.company}</p>
                  <p className="text-gray-400 text-sm">{match.location}</p>
                </div>

                {/* Fit Score and Apply Button */}
                <div className="flex items-start gap-4">
                  <div className={`px-4 py-2 rounded-lg ${getFitScoreTheme(match.fit_score)} flex items-center gap-2`}>
                    <FiStar className="text-current" />
                    <span className="font-bold">{match.fit_score}% Match</span>
                  </div>
                  <a
                    href={match.job_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <FiExternalLink />
                    Apply Now
                  </a>
                </div>
              </div>

              {/* Reasons for Match */}
              {match.reasons?.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {match.reasons.map((reason, i) => (
                    <span 
                      key={i}
                      className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm border border-blue-500/30 flex items-center gap-1"
                    >
                      <FiCheck size={14} />
                      {reason}
                    </span>
                  ))}
                </div>
              )}

              {/* Fit Message */}
              <div className="mb-6 p-4 bg-gray-700/30 rounded-lg border border-gray-700">
                <p className="text-gray-300">{match.fit_message}</p>
              </div>

              {/* Improve Section */}
              {match.improvements?.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <FiAlertTriangle className="text-yellow-400" />
                    Areas to Improve
                  </h4>
                  <ul className="space-y-2 pl-2">
                    {match.improvements.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-300">
                        <span className="text-yellow-400">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Interview Tips Section */}
              {match.interview_tips?.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <FiInfo className="text-blue-400" />
                    Interview Tips
                  </h4>
                  <ul className="space-y-2 pl-2">
                    {match.interview_tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-300">
                        <span className="text-blue-400">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Company Insights */}
              {match.company_insights && (
                <div className="p-4 bg-gray-700/30 rounded-lg border border-gray-700">
                  <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                    <FiStar className="text-purple-400" />
                    About {match.company}
                  </h4>
                  <p className="text-gray-300">{match.company_insights}</p>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}