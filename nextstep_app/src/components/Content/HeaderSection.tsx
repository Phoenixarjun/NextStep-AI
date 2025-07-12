"use client";
import { motion } from "framer-motion";
import { FiEdit3, FiZap, FiMap, FiSend } from "react-icons/fi";

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
                AI Content Agent
              </span>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-indigo-300 bg-clip-text text-transparent"
              >
                Create Once. Publish Anywhere.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-300 mb-6"
              >
                Drop your raw content ideas and let our agents craft platform-specific content for LinkedIn, GitHub, Twitter, and beyond — all in your tone.
              </motion.p>

              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 text-indigo-400">
                  <FiMap className="text-lg" />
                  <span className="text-sm font-medium">Smart Content Routing</span>
                </div>
                <div className="flex items-center gap-2 text-yellow-400">
                  <FiZap className="text-lg" />
                  <span className="text-sm font-medium">Prompt-Driven Generation</span>
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
              <h2 className="text-2xl font-bold text-white mb-6">Generate Content in Seconds</h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-indigo-500/10 text-indigo-400 p-1.5 rounded-lg mt-0.5">
                    <FiEdit3 className="text-lg" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white mb-1">Input Your Idea</h3>
                    <p className="text-gray-400 text-sm">
                      Add your title, description, achievements or links — we handle the rest.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-yellow-500/10 text-yellow-400 p-1.5 rounded-lg mt-0.5">
                    <FiSend className="text-lg" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white mb-1">One Click, Multi-Platform</h3>
                    <p className="text-gray-400 text-sm">
                      Instantly generate tailored posts for Twitter, LinkedIn, GitHub READMEs, or custom formats.
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
