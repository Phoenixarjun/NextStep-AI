"use client"
import { motion } from 'framer-motion'
import Image from 'next/image'

const Hero = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
            >
              <span className="gradient-text">Your Personal AI</span><br />
              <span className="gradient-text">Career Copilot</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl mb-8 text-gray-400"
            >
              Built with LangGraph, LangChain, and Agentic AI to boost your career readiness.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex space-x-4"
            >
              <button className="bg-secondary hover:bg-secondary/90 text-primary font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105">
                Try Now
              </button>
              <button className="border border-secondary text-secondary hover:bg-secondary/10 font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105">
                Explore Agents
              </button>
            </motion.div>
          </div>
          
          <div className="md:w-1/2 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative w-full max-w-md h-80 md:h-96"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-secondary to-accent rounded-2xl opacity-20 blur-xl"></div>
              
              <div className="relative h-full bg-primary/50 border border-gray-800 rounded-2xl overflow-hidden flex items-center justify-center">
                <div className="w-full h-full bg-gradient-to-br from-primary to-gray-900 opacity-30"></div>
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div 
                    animate={{ 
                      rotate: 360,
                    }}
                    transition={{
                      duration: 30,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="w-64 h-64 border-2 border-dashed border-secondary/30 rounded-full flex items-center justify-center"
                  >
                    <motion.div
                      className="relative w-60 h-60 rounded-full overflow-hidden"
                      animate={{
                        scale: [1, 1.05, 1],
                        boxShadow: [
                          "0 0 10px rgba(0, 191, 166, 0.5)",
                          "0 0 20px rgba(0, 191, 166, 0.8), 0 0 30px rgba(127, 0, 255, 0.6)",
                          "0 0 10px rgba(0, 191, 166, 0.5)"
                        ]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Image 
                        src="/hero.jpg" 
                        alt="AI Career Copilot" 
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                  </motion.div>
                  
                  <div className="absolute -top-5 -left-5 w-20 h-20 bg-accent rounded-full opacity-20 blur-lg"></div>
                  <div className="absolute -bottom-5 -right-5 w-20 h-20 bg-secondary rounded-full opacity-20 blur-lg"></div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero