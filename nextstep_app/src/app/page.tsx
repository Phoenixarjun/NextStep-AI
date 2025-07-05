import Navbar from '@/components/Navbar'
import Hero from '@/components/HomePage/Hero'
import AgentCards from '@/components/HomePage/AgentCards'
import HowItWorks from '@/components/HomePage/HowItWorks'
import Footer from '@/components/Footer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'NextStep-AI | Your Personal AI Career Copilot',
  description: 'Built with LangGraph, LangChain, and Agentic AI to boost your career readiness.',
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <AgentCards />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  )
}