"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeaderSection from "@/components/Resume/HeaderSection";
import ResumeAgentForm from "@/components/Resume/ResumeAgentForm";
import HowToUseCards from "@/components/HowToUseCards";
import ResumeResults from "@/components/Resume/ResumeResult";


export default function ResumePage() {
  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);


const cards = [
  {
    title: "Upload Your Resume PDF",
    description: "AI will extract skills, projects, and experience from your resume.",
    icon: "📤",
  },
  {
    title: "Describe Your Ideal Job",
    description: "Add your target domain, job type, and a sample project or job description.",
    icon: "🧾",
  },
  {
    title: "AI Reviews & Suggests",
    description: "Get personalized suggestions to improve your resume and skills.",
    icon: "🤖",
  },
  {
    title: "Actionable Feedback",
    description: "Receive short-term learning goals and project ideas to boost your profile.",
    icon: "🎯",
  },
];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 bg-gradient-to-b from-gray-900 to-gray-950">
      <Navbar />
      <main>
        <HeaderSection />
                <ResumeAgentForm
                  onResults={(results) => setResults(results)}
                  onLoading={(loading) => setIsLoading(loading)}
                />
        <HowToUseCards cards={cards} />
                {isLoading ? (
                  <div className="py-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary mx-auto"></div>
                    <p className="mt-4">Generating your personalized plan...</p>
                  </div>
                ) : (
                  results && <ResumeResults results={results} />
                )}
      </main>
      <Footer />
    </div>
  );
}