"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeaderSection from "@/components/Content/HeaderSection";
import ContentAgentForm from "@/components/Content/ContentAgentForm";
import HowToUseCards from "@/components/HowToUseCards";
import ContentResult from "@/components/Content/ContentResult";

export default function ContentPage() {
  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const cards = [
    {
      title: "Choose Your Content Type",
      description:
        "Select where your content goes — LinkedIn, Twitter, GitHub, or a custom format.",
      icon: "🧭",
    },
    {
      title: "Input Your Raw Ideas",
      description:
        "Drop in your title, description, tone, and optional links or achievements. That’s it.",
      icon: "📝",
    },
    {
      title: "Let the Agent Do the Magic",
      description:
        "Our AI agent routes your input to the right prompt chain and generates platform-optimized content.",
      icon: "⚙️",
    },
    {
      title: "Review & Deploy Anywhere",
      description:
        "Get a ready-to-post output with formatting, hashtags, tone, and structure—all done for you.",
      icon: "🚀",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 bg-gradient-to-b from-gray-900 to-gray-950">
      <Navbar />
      <main>
        <HeaderSection />

        <ContentAgentForm
          onResults={(res) => setResults(res)}
          onLoading={(loading) => setIsLoading(loading)}
        />

        <HowToUseCards cards={cards} />

        {isLoading ? (
          <div className="py-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-400 mx-auto"></div>
            <p className="mt-4">Generating your personalized content...</p>
          </div>
        ) : results && results.generated_text ? (
          <div className="max-w-6xl mx-auto px-4 py-8">
            <h2 className="gradient-text text-3xl text-center font-semibold mb-6">Generated Content</h2>
            <ContentResult
              result={results.generated_text}
              contentType={results.category}
            />
          </div>
        ) : results && results.error ? (
          <div className="text-center py-8 text-red-400 font-medium">
            ❌ Error: {results.error}
          </div>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
