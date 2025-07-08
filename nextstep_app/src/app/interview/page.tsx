"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeaderSection from "@/components/Interview/HeaderSection";
import InterviewAgentForm from "@/components/Interview/InterviewAgentForm";
import HowToUseCards from "@/components/HowToUseCards";
import InterviewerResult from "@/components/Interview/InterviewerResult";
import CandidateResult from "@/components/Interview/CandidateResult";

export default function InterviewPage() {
  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"candidate" | "interviewer">("candidate");

  const cards = [
    {
      title: "Upload Your Resume PDF",
      description: "AI reads your resume to tailor questions and preparation strategies.",
      icon: "📄",
    },
    {
      title: "Describe Your Target Role",
      description: "Specify job role, company details, and coding level for personalized prep.",
      icon: "🎯",
    },
    {
      title: "Simulate Mock Interviews",
      description: "Get realistic, AI-generated interview questions with answers and tips.",
      icon: "🎤",
    },
    {
      title: "Get Interview-Ready",
      description: "Receive company-specific insights, learning resources, and cheat sheets.",
      icon: "🚀",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 bg-gradient-to-b from-gray-900 to-gray-950">
      <Navbar />
      <main>
        <HeaderSection />
        <InterviewAgentForm
          onResults={(results) => setResults(results)}
          onLoading={(loading) => setIsLoading(loading)}
          onModeChange={(selectedMode) => setMode(selectedMode)}
        />
        <HowToUseCards cards={cards} />
        {isLoading ? (
          <div className="py-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary mx-auto"></div>
            <p className="mt-4">Generating your interview preparation plan...</p>
          </div>
        ) : (
          results && (
            mode === "candidate" ? (
              <CandidateResult results={results} />
            ) : (
              <InterviewerResult results={results} />
            )
          )
        )}
      </main>
      <Footer />
    </div>
  );
}
