"use client";
import { motion } from "framer-motion";
import { FiUpload, FiTarget, FiZap, FiMessageSquare } from "react-icons/fi";

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
              <span className="inline-block bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-sm font-medium mb-4">
                Smart Interview Assistant
              </span>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-indigo-300 bg-clip-text text-transparent"
              >
                Ask. Learn. Excel.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-300 mb-6"
              >
                From resume tips to company-specific questions — interact with our AI to accelerate your interview prep in real time.
              </motion.p>

              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 text-indigo-400">
                  <FiTarget className="text-lg" />
                  <span className="text-sm font-medium">Tailored Interview Guidance</span>
                </div>
                <div className="flex items-center gap-2 text-yellow-400">
                  <FiZap className="text-lg" />
                  <span className="text-sm font-medium">Real-Time Response & Insights</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Feature Box */}
          <div className="lg:w-1/2 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 shadow-xl"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Your AI-Powered Interview Companion</h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-indigo-500/10 text-indigo-400 p-1.5 rounded-lg mt-0.5">
                    <FiUpload className="text-lg" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white mb-1">Resume Intelligence</h3>
                    <p className="text-gray-400 text-sm">
                      Upload your resume to let our AI understand your background and customize the preparation journey.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-yellow-500/10 text-yellow-400 p-1.5 rounded-lg mt-0.5">
                    <FiMessageSquare className="text-lg" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white mb-1">Conversational Coaching</h3>
                    <p className="text-gray-400 text-sm">
                      Ask anything — from role-specific questions to company insights — and get contextual answers instantly.
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
