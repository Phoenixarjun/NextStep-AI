"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { FiChevronDown, FiChevronUp, FiExternalLink, FiCheck, FiX } from "react-icons/fi";
import { toast } from "react-hot-toast";

interface Recommendation {
  topics_to_focus: string[];
  preparation_tips: string[];
  company_insights: string;
  cheat_sheets: { title: string; url: string }[];
  suggested_practice_platforms: string[];
}

interface MockQuestion {
  question: string;
  options: string[];
  answer: string;
  userAnswer?: string;
  isCorrect?: boolean;
}

interface InterviewResult {
  recommendations: Recommendation;
  mock_questions: MockQuestion[];
}

export default function CandidateResults({ results }: { results: any }) {
  const [expandedSection, setExpandedSection] = useState<string>("recommendations");
  const [interviewMode, setInterviewMode] = useState<"prep" | "interview" | "results">("prep");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [timerActive, setTimerActive] = useState(false);

  if (!results || !results.response) return null;

  let parsedContent: InterviewResult;
  try {
    const jsonString = results.response.match(/```json\n([\s\S]*?)\n```/)?.[1] || results.response;
    parsedContent = JSON.parse(jsonString);
  } catch (error) {
    console.error("Failed to parse interview results:", error);
    return (
      <div className="bg-red-500/10 text-red-400 p-4 rounded-lg border border-red-500/30">
        Error: Could not parse interview results data
      </div>
    );
  }

  const { recommendations, mock_questions } = parsedContent;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && interviewMode === "interview") {
      handleNextQuestion();
    }
    return () => clearInterval(interval);
  }, [timerActive, timeRemaining, interviewMode]);

  const startInterview = () => {
    setInterviewMode("interview");
    setTimerActive(true);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
  };

  const handleAnswerSelect = (answer: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answer
    }));
    setTimerActive(false);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < mock_questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeRemaining(30);
      setTimerActive(true);
    } else {
      calculateScore();
      setInterviewMode("results");
    }
  };

  const calculateScore = () => {
    let correct = 0;
    mock_questions.forEach((question, index) => {
      if (userAnswers[index] === question.answer) {
        correct++;
      }
    });
    const scorePercentage = Math.round((correct / mock_questions.length) * 100);
    setScore(scorePercentage);
  };

  const resetInterview = () => {
    setInterviewMode("prep");
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setScore(null);
    setTimeRemaining(30);
    setTimerActive(false);
  };

  const getScoreMessage = () => {
    if (score === null) return "";
    if (score >= 80) return "Excellent! You're well prepared for this interview.";
    if (score >= 60) return "Good job! You're on the right track but could use some more practice.";
    if (score >= 40) return "Not bad! Focus on the areas below to improve.";
    return "Keep practicing! Review the recommendations below to strengthen your knowledge.";
  };

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-800/70 to-gray-900/50 border border-gray-700 rounded-xl p-6 shadow-xl"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Interview Preparation for {results.input.role_applying_for}
              </h2>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm">
                  {results.input.company_name}
                </span>
                <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-sm">
                  {results.input.job_type}
                </span>
                <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-sm">
                  {results.input.domain}
                </span>
              </div>
            </div>
            {interviewMode === "prep" && (
              <button
                onClick={startInterview}
                className="bg-gradient-to-r from-emerald-800 to-emerald-500 hover:from-secondary/90 hover:to-emerald-500/90 text-white px-6 py-3 rounded-lg font-medium transition-all"
              >
                Start Mock Interview
              </button>
            )}
          </div>

          {/* Interview Mode */}
          {interviewMode === "interview" && (
            <div className="mb-8 bg-gray-800/30 rounded-xl border border-gray-700 p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="text-lg font-semibold text-gray-300">
                  Question {currentQuestionIndex + 1} of {mock_questions.length}
                </div>
                <div className={`px-3 py-1 rounded-full ${
                  timeRemaining > 10 ? "bg-blue-500/10 text-blue-400" : "bg-red-500/10 text-red-400"
                }`}>
                  Time: {timeRemaining}s
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-6">
                {mock_questions[currentQuestionIndex].question}
              </h3>

              <div className="space-y-3">
                {mock_questions[currentQuestionIndex].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={userAnswers[currentQuestionIndex] !== undefined}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      userAnswers[currentQuestionIndex] === option
                        ? option === mock_questions[currentQuestionIndex].answer
                          ? "bg-green-500/10 border-green-500/30"
                          : "bg-red-500/10 border-red-500/30"
                        : "bg-gray-700/50 border-gray-600 hover:bg-gray-700/30"
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="mr-3 font-mono">{String.fromCharCode(65 + index)}.</span>
                      <span>{option}</span>
                    </div>
                  </button>
                ))}
              </div>

              {userAnswers[currentQuestionIndex] !== undefined && (
                <div className="mt-6">
                  <div className={`p-4 rounded-lg mb-4 ${
                    userAnswers[currentQuestionIndex] === mock_questions[currentQuestionIndex].answer
                      ? "bg-green-500/10 text-green-400 border border-green-500/30"
                      : "bg-red-500/10 text-red-400 border border-red-500/30"
                  }`}>
                    <div className="flex items-center gap-2 font-semibold mb-2">
                      {userAnswers[currentQuestionIndex] === mock_questions[currentQuestionIndex].answer ? (
                        <>
                          <FiCheck className="text-green-400" />
                          Correct!
                        </>
                      ) : (
                        <>
                          <FiX className="text-red-400" />
                          Incorrect
                        </>
                      )}
                    </div>
                    <p>
                      The correct answer is: <span className="font-semibold">{mock_questions[currentQuestionIndex].answer}</span>
                    </p>
                  </div>

                  <button
                    onClick={handleNextQuestion}
                    className="w-full bg-gradient-to-r from-secondary to-emerald-500 hover:from-secondary/90 hover:to-emerald-500/90 text-white py-3 rounded-lg font-medium transition-all"
                  >
                    {currentQuestionIndex < mock_questions.length - 1 ? "Next Question" : "See Results"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Results Mode */}
          {interviewMode === "results" && score !== null && (
            <div className="mb-8 bg-gray-800/30 rounded-xl border border-gray-700 p-6">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">
                  Your Score: {score}%
                </div>
                <div className={`text-xl mb-6 ${
                  score >= 80 ? "text-green-400" :
                  score >= 60 ? "text-yellow-400" :
                  score >= 40 ? "text-orange-400" : "text-red-400"
                }`}>
                  {getScoreMessage()}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-300 mb-3">Correct Answers</h3>
                    <div className="space-y-2">
                      {mock_questions.map((question, index) => (
                        userAnswers[index] === question.answer && (
                          <div key={index} className="flex items-start gap-2 p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                            <FiCheck className="text-green-400 mt-1 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-gray-200">Q{index + 1}: {question.question}</p>
                              <p className="text-sm text-gray-400">Your answer: {userAnswers[index]}</p>
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-300 mb-3">Areas to Improve</h3>
                    <div className="space-y-2">
                      {mock_questions.map((question, index) => (
                        userAnswers[index] !== question.answer && (
                          <div key={index} className="flex items-start gap-2 p-3 bg-red-500/10 rounded-lg border border-red-500/30">
                            <FiX className="text-red-400 mt-1 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-gray-200">Q{index + 1}: {question.question}</p>
                              <p className="text-sm text-gray-400">Your answer: {userAnswers[index] || "No answer"}</p>
                              <p className="text-sm text-gray-400">Correct answer: {question.answer}</p>
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={resetInterview}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-all"
                  >
                    Retake Interview
                  </button>
                  <button
                    onClick={() => setInterviewMode("prep")}
                    className="bg-gradient-to-r from-secondary to-emerald-500 hover:from-secondary/90 hover:to-emerald-500/90 text-white px-6 py-3 rounded-lg font-medium transition-all"
                  >
                    View Preparation Materials
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
            <button
              onClick={() => setExpandedSection("recommendations")}
              className={`flex items-center justify-center p-3 rounded-lg transition-all ${
                expandedSection === "recommendations"
                  ? "bg-secondary/10 border border-secondary/30"
                  : "bg-gray-800/30 hover:bg-gray-700/50"
              }`}
            >
              <span className="text-xl mr-2">📝</span>
              <span>Recommendations</span>
            </button>
            <button
              onClick={() => setExpandedSection("questions")}
              className={`flex items-center justify-center p-3 rounded-lg transition-all ${
                expandedSection === "questions"
                  ? "bg-secondary/10 border border-secondary/30"
                  : "bg-gray-800/30 hover:bg-gray-700/50"
              }`}
            >
              <span className="text-xl mr-2">❓</span>
              <span>Practice Questions</span>
            </button>
            <button
              onClick={() => setExpandedSection("resources")}
              className={`flex items-center justify-center p-3 rounded-lg transition-all ${
                expandedSection === "resources"
                  ? "bg-secondary/10 border border-secondary/30"
                  : "bg-gray-800/30 hover:bg-gray-700/50"
              }`}
            >
              <span className="text-xl mr-2">📚</span>
              <span>Resources</span>
            </button>
          </div>

          {/* Content Sections */}
          <div className="space-y-6">
            {/* Recommendations Section */}
            <AnimatePresence>
              {expandedSection === "recommendations" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-6"
                >
                  {/* Topics to Focus */}
                  <div className="bg-gray-800/30 rounded-xl border border-gray-700 p-6">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <span className="bg-blue-500/10 text-blue-400 p-2 rounded-lg">🎯</span>
                      Topics to Focus On
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {recommendations.topics_to_focus.map((topic, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                          <div className="bg-blue-500/10 text-blue-400 p-1 rounded-full mt-1">
                            <span>{index + 1}</span>
                          </div>
                          <p className="text-gray-300">{topic}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Preparation Tips */}
                  <div className="bg-gray-800/30 rounded-xl border border-gray-700 p-6">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <span className="bg-purple-500/10 text-purple-400 p-2 rounded-lg">💡</span>
                      Preparation Tips
                    </h3>
                    <div className="space-y-3">
                      {recommendations.preparation_tips.map((tip, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                          <div className="bg-purple-500/10 text-purple-400 p-1 rounded-full mt-1">
                            <span>{index + 1}</span>
                          </div>
                          <p className="text-gray-300">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Company Insights */}
                  {recommendations.company_insights && (
                    <div className="bg-gray-800/30 rounded-xl border border-gray-700 p-6">
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <span className="bg-green-500/10 text-green-400 p-2 rounded-lg">🏢</span>
                        Company Insights
                      </h3>
                      <p className="text-gray-300">{recommendations.company_insights}</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Questions Section */}
            <AnimatePresence>
              {expandedSection === "questions" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-gray-800/30 rounded-xl border border-gray-700 p-6">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <span className="bg-yellow-500/10 text-yellow-400 p-2 rounded-lg">❓</span>
                      Practice Questions
                    </h3>
                    <div className="space-y-6">
                      {mock_questions.map((question, index) => (
                        <div key={index} className="bg-gray-900/50 rounded-lg border border-gray-700 overflow-hidden">
                          <div className="p-4">
                            <h4 className="text-lg font-semibold text-white mb-3">
                              Q{index + 1}: {question.question}
                            </h4>
                            <div className="space-y-2">
                              {question.options.map((option, optIndex) => (
                                <div
                                  key={optIndex}
                                  className={`p-3 rounded-lg border ${
                                    option === question.answer
                                      ? "bg-green-500/10 border-green-500/30"
                                      : "bg-gray-800/50 border-gray-700"
                                  }`}
                                >
                                  <p className="text-gray-300">
                                    {String.fromCharCode(65 + optIndex)}. {option}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Resources Section */}
            <AnimatePresence>
              {expandedSection === "resources" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-6"
                >
                  {/* Cheat Sheets */}
                  {recommendations.cheat_sheets.length > 0 && (
                    <div className="bg-gray-800/30 rounded-xl border border-gray-700 p-6">
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <span className="bg-red-500/10 text-red-400 p-2 rounded-lg">📋</span>
                        Cheat Sheets & Quick References
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {recommendations.cheat_sheets.map((sheet, index) => (
                          <a
                            key={index}
                            href={sheet.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 hover:bg-gray-700/30 transition-colors flex items-center justify-between"
                          >
                            <span className="text-gray-300">{sheet.title}</span>
                            <FiExternalLink className="text-gray-400" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Practice Platforms */}
                  {recommendations.suggested_practice_platforms.length > 0 && (
                    <div className="bg-gray-800/30 rounded-xl border border-gray-700 p-6">
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <span className="bg-purple-500/10 text-purple-400 p-2 rounded-lg">💻</span>
                        Suggested Practice Platforms
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {recommendations.suggested_practice_platforms.map((platform, index) => (
                          <div key={index} className="px-4 py-2 bg-purple-500/10 text-purple-400 rounded-full border border-purple-500/30">
                            {platform}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}