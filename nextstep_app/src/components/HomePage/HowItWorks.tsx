"use client"
import { motion } from 'framer-motion'

const steps = [
  {
    title: "Upload Resume / Give Info",
    description: "Provide your resume, LinkedIn profile, or answer a few questions about your career goals.",
    icon: "1"
  },
  {
    title: "AI Agents Analyze & Plan",
    description: "Our specialized AI agents work together to assess your profile and identify opportunities.",
    icon: "2"
  },
  {
    title: "Get Roadmaps & Feedback",
    description: "Receive personalized career roadmaps, skill assessments, and practice recommendations.",
    icon: "3"
  }
]

const HowItWorks = () => {
  return (
    <section className="py-20 px-4 bg-gray-900/50">
      <div className="container mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-16 gradient-text"
        >
          How It Works
        </motion.h2>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="hidden md:block absolute left-1/2 h-full w-0.5 bg-gradient-to-b from-secondary via-accent to-secondary transform -translate-x-1/2"></div>
          
          <div className="space-y-16 md:space-y-0">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`relative flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                {/* Timeline dot */}
                <div className="hidden md:flex absolute left-1/2 w-6 h-6 bg-secondary rounded-full transform -translate-x-1/2 -translate-y-1/2 items-center justify-center z-10">
                  <span className="text-primary font-bold">{step.icon}</span>
                </div>
                
                {/* Content */}
                <div className={`md:w-5/12 p-6 rounded-xl ${index % 2 === 0 ? 'md:mr-auto md:pr-16' : 'md:ml-auto md:pl-16'}`}>
                  <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 hover:neon-border transition-all duration-300">
                    <h3 className="text-xl font-bold mb-4 text-white">{step.title}</h3>
                    <p className="text-gray-400">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks