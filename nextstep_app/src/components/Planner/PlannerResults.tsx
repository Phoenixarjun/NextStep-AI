"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FiChevronDown, FiChevronUp, FiExternalLink } from 'react-icons/fi';

interface Resource {
  name: string;
  url: string;
}

interface RoadmapWeek {
  week: number;
  focus_goal: string;
  concepts: string[];
  resources: Resource[];
  mini_project: string;
  tips: string[];
}

interface PlannerResults {
  domain: string;
  roadmap: string | RoadmapWeek[];
  summary?: string;
}

export default function PlannerResults({ results }: { results: PlannerResults | null }) {
  const [expandedWeek, setExpandedWeek] = useState<number | null>(0);

  if (!results) return null;

  // Enhanced markdown parser that handles your specific format
const parseMarkdownRoadmap = (markdown: string): RoadmapWeek[] => {
  const weeks: RoadmapWeek[] = [];

  // Split based on "### Week N"
  const weekSections = markdown.split(/### Week \d+.*\n/).slice(1);

  weekSections.forEach((content, index) => {
    const week: RoadmapWeek = {
      week: index + 1,
      focus_goal: '',
      concepts: [],
      resources: [],
      mini_project: '',
      tips: []
    };

    // Focus Goal
    const focusMatch = content.match(/📌\s+\*\*Focus Goal:\*\*\s*(.+)/);
    if (focusMatch) week.focus_goal = focusMatch[1].trim();

    // Concepts
    const conceptsMatch = content.match(/🧠\s+\*\*Tech Stack\/Concepts to learn:\*\*([\s\S]*?)(?=\n[-*]?\s*(🔧|💻|💡|\*\*|###|$))/);
    if (conceptsMatch) {
      week.concepts = conceptsMatch[1]
        .split(/\n/)
        .map(line => line.replace(/^[-*]\s*/, '').trim())
        .filter(line => line.length > 0);
    }

    // Resources
    const resourcesMatch = content.match(/🔧\s+\*\*Resources:\*\*([\s\S]*?)(?=\n[-*]?\s*(💻|💡|\*\*|###|$))/);
    if (resourcesMatch) {
      const links = resourcesMatch[1].match(/\[([^\]]+)\]\(([^)]+)\)/g);
      if (links) {
        week.resources = links.map(link => {
          const parts = link.match(/\[([^\]]+)\]\(([^)]+)\)/);
          return parts ? { name: parts[1].trim(), url: parts[2].trim() } : null;
        }).filter(Boolean) as Resource[];
      }
    }

    // Mini Project
    const projectMatch = content.match(/💻\s+\*\*Mini Project Idea:\*\*([\s\S]*?)(?=\n[-*]?\s*(💡|\*\*|###|$))/);
    if (projectMatch) {
      week.mini_project = projectMatch[1].replace(/\n+/g, ' ').trim();
    }

    // Tips
    const tipsMatch = content.match(/💡\s+\*\*Tips or common mistakes:\*\*([\s\S]*?)(?=\n###|$)/);
    if (tipsMatch) {
      week.tips = tipsMatch[1]
        .split(/\n/)
        .map(line => line.replace(/^[-*]\s*/, '').trim())
        .filter(line => line.length > 0);
    }

    weeks.push(week);
  });

  return weeks;
};


  const roadmapData = typeof results.roadmap === 'string' 
    ? parseMarkdownRoadmap(results.roadmap) 
    : Array.isArray(results.roadmap) 
      ? results.roadmap 
      : [];

  // Function to clean up resource names that are just URLs
  const cleanResourceName = (name: string, url: string) => {
    if (name.startsWith('http')) {
      try {
        return new URL(url).hostname.replace('www.', '');
      } catch {
        return name.replace(/^https?:\/\//, '').split('/')[0];
      }
    }
    return name;
  };

  return (
    <section className="py-12 px-4 ">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-1/3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-gray-800/70 to-gray-900/50 border border-gray-700 rounded-xl p-6 sticky top-6 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-secondary/20 p-2 rounded-lg">
                  <span className="text-2xl">🧭</span>
                </div>
                <h2 className="text-2xl font-bold gradient-text">
                  {results.domain}
                </h2>
              </div>
              
              {results.summary && (
                <div className="mt-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                  <p className="text-gray-300">{results.summary}</p>
                </div>
              )}
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-200 mb-2">Roadmap Overview</h3>
                <div className="space-y-2">
                  {roadmapData.map((week, index) => (
                    <button
                      key={index}
                      onClick={() => setExpandedWeek(expandedWeek === index ? null : index)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                        expandedWeek === index 
                          ? 'bg-secondary/10 border border-secondary/30' 
                          : 'bg-gray-800/30 hover:bg-gray-700/50'
                      }`}
                    >
                      <span className="font-medium text-gray-200 text-left">
                        Week {week.week}: {week.focus_goal || `Week ${week.week}`}
                      </span>
                      {expandedWeek === index ? (
                        <FiChevronUp className="text-gray-400 shrink-0" />
                      ) : (
                        <FiChevronDown className="text-gray-400 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="md:w-2/3">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">
                Your Learning Journey
              </h3>
              <div className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm">
                {roadmapData.length} weeks
              </div>
            </div>

            <div className="space-y-6">
              {roadmapData.map((week, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-gray-800/50 to-gray-900/30 border border-gray-700 rounded-xl overflow-hidden shadow-lg"
                >
                  <button
                    onClick={() => setExpandedWeek(expandedWeek === index ? null : index)}
                    className="w-full flex justify-between items-center p-5 text-left hover:bg-gray-700/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 text-primary px-3 py-2 rounded-full shadow-sm shadow-white">
                        <span className="font-mono font-bold">W{week.week}</span>
                      </div>
                      <h4 className="text-xl font-bold text-white">
                        {week.focus_goal || `Week ${week.week} Resources`}
                      </h4>
                    </div>
                    {expandedWeek === index ? (
                      <FiChevronUp className="text-gray-400 text-xl" />
                    ) : (
                      <FiChevronDown className="text-gray-400 text-xl" />
                    )}
                  </button>

                  <AnimatePresence>
                    {expandedWeek === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-5 pb-5"
                      >
                        <div className="space-y-6 pt-2">
                          {/* Focus Goal */}
                          {week.focus_goal && (
                            <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700">
                              <h5 className="font-semibold text-lg text-white mb-2 flex items-center gap-2">
                                <span className="bg-purple-500/10 text-purple-400 p-1.5 rounded-lg">🎯</span>
                                Focus Goal
                              </h5>
                              <p className="text-gray-300">{week.focus_goal}</p>
                            </div>
                          )}

                          {/* Concepts Section */}
                          {week.concepts.length > 0 && (
                            <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700">
                              <h5 className="font-semibold text-lg text-white mb-3 flex items-center gap-2">
                                <span className="bg-blue-500/10 text-blue-400 p-1.5 rounded-lg">🧠</span>
                                Concepts to Master
                              </h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {week.concepts.map((concept, i) => (
                                  <div key={i} className="bg-gray-700/50 rounded-lg p-3 flex items-start gap-2">
                                    <div className="bg-blue-500/10 text-blue-400 p-1 rounded-full mt-0.5">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                      </svg>
                                    </div>
                                    <span className="text-gray-300">{concept}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Resources Section */}
                          {week.resources.length > 0 && (
                            <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700">
                              <h5 className="font-semibold text-lg text-white mb-3 flex items-center gap-2">
                                <span className="bg-green-500/10 text-green-400 p-1.5 rounded-lg">🔗</span>
                                Recommended Resources
                              </h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {week.resources.map((resource, i) => (
                                  <a
                                    key={i}
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group bg-gray-700/50 hover:bg-gray-700 rounded-lg p-3 transition-colors"
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-gray-200 group-hover:text-white">
                                        {cleanResourceName(resource.name, resource.url)}
                                      </span>
                                      <FiExternalLink className="text-gray-400 group-hover:text-white" />
                                    </div>
                                    <div className="mt-1 text-xs text-gray-400 truncate">
                                      {resource.url.replace(/^https?:\/\//, '')}
                                    </div>
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Mini Project Section */}
                          {week.mini_project && (
                            <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700">
                              <h5 className="font-semibold text-lg text-white mb-3 flex items-center gap-2">
                                <span className="bg-yellow-500/10 text-yellow-400 p-1.5 rounded-lg">💻</span>
                                Mini Project Idea
                              </h5>
                              <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                                <div className="flex items-start gap-3">
                                  <div className="bg-yellow-500/10 text-yellow-400 p-2 rounded-lg mt-0.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                      <polyline points="14 2 14 8 20 8"></polyline>
                                      <line x1="16" y1="13" x2="8" y2="13"></line>
                                      <line x1="16" y1="17" x2="8" y2="17"></line>
                                      <polyline points="10 9 9 9 8 9"></polyline>
                                    </svg>
                                  </div>
                                  <p className="text-gray-300">{week.mini_project}</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Tips Section */}
                          {week.tips.length > 0 && (
                            <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700">
                              <h5 className="font-semibold text-lg text-white mb-3 flex items-center gap-2">
                                <span className="bg-red-500/10 text-red-400 p-1.5 rounded-lg">💡</span>
                                Tips & Recommendations
                              </h5>
                              <div className="space-y-3">
                                {week.tips.map((tip, i) => (
                                  <div key={i} className="flex items-start gap-3 bg-gray-900/30 p-3 rounded-lg border border-gray-700">
                                    <div className="bg-red-500/10 text-red-400 p-1 rounded-full mt-0.5">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="12" y1="8" x2="12" y2="12"></line>
                                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                      </svg>
                                    </div>
                                    <p className="text-gray-300">{tip}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}