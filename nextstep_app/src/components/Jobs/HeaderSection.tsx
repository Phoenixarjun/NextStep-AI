"use client";
import { motion } from "framer-motion";
import { FiSearch, FiTrendingUp, FiMapPin, FiFileText } from "react-icons/fi";

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
              <span className="inline-block bg-violet-500/20 text-violet-400 px-3 py-1 rounded-full text-sm font-medium mb-4">
                AI Job Match Agent
              </span>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-violet-300 bg-clip-text text-transparent"
              >
                Find Jobs. Fit Better. Win Faster.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-300 mb-6"
              >
                Upload your resume and preferences, and let our AI find real job openings that match your profile—with tailored feedback and readiness suggestions.
              </motion.p>

              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 text-violet-400">
                  <FiTrendingUp className="text-lg" />
                  <span className="text-sm font-medium">Fit Score & Insights</span>
                </div>
                <div className="flex items-center gap-2 text-cyan-400">
                  <FiMapPin className="text-lg" />
                  <span className="text-sm font-medium">Location & Mode Filter</span>
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
              <h2 className="text-2xl font-bold text-white mb-6">Find Your Perfect Fit</h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-violet-500/10 text-violet-400 p-1.5 rounded-lg mt-0.5">
                    <FiSearch className="text-lg" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white mb-1">Smart Job Matching</h3>
                    <p className="text-gray-400 text-sm">
                      Our AI fetches real jobs from Google and evaluates how well they align with your resume and goals.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-cyan-500/10 text-cyan-400 p-1.5 rounded-lg mt-0.5">
                    <FiFileText className="text-lg" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white mb-1">Guided Resume Feedback</h3>
                    <p className="text-gray-400 text-sm">
                      Get actionable suggestions to enhance your resume or switch to our Resume Agent for deeper improvements.
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
