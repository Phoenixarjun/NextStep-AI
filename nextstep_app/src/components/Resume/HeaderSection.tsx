"use client";
import { motion } from "framer-motion";
import { FiUpload, FiTarget, FiZap, FiFileText } from "react-icons/fi";

export default function HeaderSection() {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Left Content */}
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <span className="inline-block bg-teal-500/20 text-teal-400 px-3 py-1 rounded-full text-sm font-medium mb-4">
                Resume Intelligence Agent
              </span>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-teal-300 bg-clip-text text-transparent"
              >
                Analyze. Improve. Stand Out.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-300 mb-6"
              >
                Upload your resume and let our AI give you actionable feedback, skill suggestions, and learning goals tailored for your dream tech job.
              </motion.p>

              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 text-teal-400">
                  <FiTarget className="text-lg" />
                  <span className="text-sm font-medium">Domain-Specific Insights</span>
                </div>
                <div className="flex items-center gap-2 text-purple-400">
                  <FiZap className="text-lg" />
                  <span className="text-sm font-medium">Smart Suggestions</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Form Box */}
          <div className="lg:w-1/2 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 shadow-xl"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Get Evaluated Instantly</h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-teal-500/10 text-teal-400 p-1.5 rounded-lg mt-0.5">
                    <FiUpload className="text-lg" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white mb-1">PDF Upload</h3>
                    <p className="text-gray-400 text-sm">
                      Upload your resume and our AI will review your projects, skills, and experiences in seconds.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-purple-500/10 text-purple-400 p-1.5 rounded-lg mt-0.5">
                    <FiFileText className="text-lg" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white mb-1">No Resume? No Problem</h3>
                    <p className="text-gray-400 text-sm">
                      Just describe your target job, domain, and what you’ve worked on—we’ll handle the rest.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
