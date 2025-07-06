"use client";
import { useState } from "react";
import HeaderSection from "@/components/Planner/HeaderSection";
import PlannerFormTabs from "@/components/Planner/PlannerFormTabs";
import HowToUseCards from "@/components/HowToUseCards";
import PlannerResults from "@/components/Planner/PlannerResults";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PlannerPage() {
  const [activeTab, setActiveTab] = useState<"resume" | "manual">("resume");
  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);


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

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 bg-gradient-to-b from-gray-900 to-gray-950">
      <Navbar />
      <main>
        <HeaderSection activeTab={activeTab} setActiveTab={setActiveTab} />
        <PlannerFormTabs
          activeTab={activeTab}
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
          results && <PlannerResults results={results} />
        )}
      </main>
      <Footer />
    </div>
  );
}