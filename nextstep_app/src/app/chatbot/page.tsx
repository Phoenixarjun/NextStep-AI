"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeaderSection from "@/components/Chatbot/HeaderSection";
import JobAgentForm from "@/components/Jobs/JobAgentForm";
import HowToUseCards from "@/components/HowToUseCards";
import JobResult from "@/components/Jobs/JobResult";
import Chatbot from "@/components/Chatbot/Chatbot";


export default function JobPage() {
  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);


const cards = [
  {
    title: "Upload Your Resume",
    description: "AI scans your resume to extract key skills, experience, and context for personalized responses.",
    icon: "📄",
  },
  {
    title: "Ask Role-Specific Questions",
    description: "Get insights, mock answers, and tips tailored to your resume and job role.",
    icon: "💬",
  },
  {
    title: "Get Instant AI-Powered Responses",
    description: "The chatbot uses your resume + external sources to give smart, contextual answers.",
    icon: "⚡",
  },
  {
    title: "Boost with Wikipedia Insights",
    description: "Factual enhancements are added to your response for well-rounded answers and clarity.",
    icon: "🌍",
  },
];



  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 bg-gradient-to-b from-gray-900 to-gray-950">
      <Navbar />
      <main>
        <HeaderSection />
        <Chatbot />
        <HowToUseCards cards={cards} />
      </main>
      <Footer />
    </div>
  );
}