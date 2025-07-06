"use client";
import { motion } from "framer-motion";

const cards = [
  {
    title: "Upload Your Resume",
    description: "We'll auto-analyze skills and suggest a path.",
    icon: "📄",
  },
  {
    title: "No Resume? Fill the Form",
    description: "Tell us your strengths and interests.",
    icon: "✍️",
  },
  {
    title: "AI Agent Plans Your Career",
    description: "Get a roadmap tailored to your goals.",
    icon: "🧠",
  },
  {
    title: "Start Learning Instantly",
    description: "Resources, projects, and portfolio tips included.",
    icon: "🚀",
  },
];

export default function HowToUseCards() {
  return (
    <section className="py-12 px-4">
      <div className="container mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-bold text-center mb-12 gradient-text"
        >
          How It Works
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-secondary transition-all"
            >
              <div className="text-4xl mb-4">{card.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-white">{card.title}</h3>
              <p className="text-gray-400">{card.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}