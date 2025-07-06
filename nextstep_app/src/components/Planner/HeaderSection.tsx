"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { FiUpload, FiEdit3, FiAward, FiCalendar } from "react-icons/fi";

export default function HeaderSection({
  activeTab,
  setActiveTab,
}: {
  activeTab: "resume" | "manual";
  setActiveTab: (tab: "resume" | "manual") => void;
}) {
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
              <span className="inline-block bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium mb-4">
                AI-Powered Career Planner
              </span>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent"
              >
                Craft Your Perfect Tech Roadmap
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-300 mb-6"
              >
                Get a personalized 6-week learning plan tailored to your unique skills and career aspirations.
              </motion.p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 text-blue-400">
                  <FiAward className="text-lg" />
                  <span className="text-sm font-medium">Skill Assessment</span>
                </div>
                <div className="flex items-center gap-2 text-purple-400">
                  <FiCalendar className="text-lg" />
                  <span className="text-sm font-medium">Custom Schedule</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:w-1/2 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 shadow-xl"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Get Started</h2>
              
              <div className="flex mb-8 bg-gray-900/50 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab("resume")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 font-medium rounded-md transition-all ${
                    activeTab === "resume"
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  <FiUpload className="text-lg" />
                  Upload Resume
                </button>
                <button
                  onClick={() => setActiveTab("manual")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 font-medium rounded-md transition-all ${
                    activeTab === "manual"
                      ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  <FiEdit3 className="text-lg" />
                  Manual Input
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-500/10 text-blue-400 p-1.5 rounded-lg mt-0.5">
                    <FiUpload className="text-lg" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white mb-1">Resume Upload</h3>
                    <p className="text-gray-400 text-sm">
                      We'll analyze your resume and extract your skills to create a personalized plan.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-purple-500/10 text-purple-400 p-1.5 rounded-lg mt-0.5">
                    <FiEdit3 className="text-lg" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white mb-1">Manual Input</h3>
                    <p className="text-gray-400 text-sm">
                      Tell us about your skills, interests, and goals to get a customized roadmap.
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