"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeaderSection from "@/components/Jobs/HeaderSection";
import JobAgentForm from "@/components/Jobs/JobAgentForm";
import HowToUseCards from "@/components/HowToUseCards";
import JobResult from "@/components/Jobs/JobResult";


export default function JobPage() {
  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);


const cards = [
  {
    title: "Upload Your Resume",
    description: "AI parses your resume to understand skills, experience, and job readiness.",
    icon: "📄",
  },
  {
    title: "Set Your Job Preferences",
    description: "Enter job role, city, mode (remote/hybrid/onsite), and expected CTC.",
    icon: "🎯",
  },
  {
    title: "AI Finds Matching Jobs",
    description: "Jobs are fetched in real time from Google based on your profile and filters.",
    icon: "🔍",
  },
  {
    title: "Fit Score + Insights",
    description: "Each job is scored against your resume with suggestions to improve fit or redirect using other agents.",
    icon: "📊",
  },
];


  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 bg-gradient-to-b from-gray-900 to-gray-950">
      <Navbar />
      <main>
        <HeaderSection />
                <JobAgentForm
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
                  results && <JobResult results={results} />
                )}
      </main>
      <Footer />
    </div>
  );
}