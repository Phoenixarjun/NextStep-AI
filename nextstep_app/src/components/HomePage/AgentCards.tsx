"use client"
import { motion } from 'framer-motion'
import { BriefcaseIcon, DocumentTextIcon, ChatBubbleLeftRightIcon, AcademicCapIcon, UserGroupIcon } from '@heroicons/react/24/outline'

const agents = [
  {
    icon: <DocumentTextIcon className="w-10 h-10 text-secondary" />,
    name: "Resume Agent",
    description: "Analyzes and optimizes your resume for ATS and human readers with actionable feedback.",
    route: "/resume"
  },
  {
    icon: <BriefcaseIcon className="w-10 h-10 text-secondary" />,
    name: "Job Match Agent",
    description: "Matches your profile with ideal job openings and suggests skill improvements.",
    route: "/jobs"
  },
  {
    icon: <ChatBubbleLeftRightIcon className="w-10 h-10 text-secondary" />,
    name: "Interview Agent",
    description: "Simulates technical and behavioral interviews with real-time feedback.",
    route: "/interview"
  },
  {
    icon: <AcademicCapIcon className="w-10 h-10 text-secondary" />,
    name: "Learning Agent",
    description: "Creates personalized learning paths based on your career goals.",
    route: "/learn"
  },
  {
    icon: <UserGroupIcon className="w-10 h-10 text-secondary" />,
    name: "Network Agent",
    description: "Suggests networking opportunities and helps craft outreach messages.",
    route: "/network"
  }
]

const AgentCards = () => {
  return (
    <section className="py-20 px-4 bg-primary">
      <div className="container mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-16 gradient-text"
        >
          AI Agents at Your Service
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {agents.map((agent, index) => (
            <motion.div
              key={agent.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-gray-900/50 hover:bg-gray-800/70 border border-gray-800 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/10"
            >
              <div className="flex flex-col h-full">
                <div className="mb-4">{agent.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-white">{agent.name}</h3>
                <p className="text-gray-400 mb-6 flex-grow">{agent.description}</p>
                <button className="mt-auto w-full py-2 px-4 border border-secondary text-secondary rounded-lg hover:bg-secondary/10 transition-colors duration-300">
                  Let's Try It
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AgentCards