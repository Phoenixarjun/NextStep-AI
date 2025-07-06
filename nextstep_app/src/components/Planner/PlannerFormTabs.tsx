"use client";
import { motion } from "framer-motion";
import { useState, useRef, ChangeEvent } from "react";
import { CodingLevel, Interest, PlannerFormData } from "./types";

const API_BASE_URL = "http://localhost:8000";

export default function PlannerFormTabs({
  activeTab,
  onResults,
  onLoading,
}: {
  activeTab: "resume" | "manual";
  onResults: (results: any) => void;
  onLoading: (isLoading: boolean) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<PlannerFormData>({
    coding_level: "Basic",
    interests: [],
    self_description: "",
    week_plan: 6,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const submitManualForm = async (data: PlannerFormData) => {
    onLoading(true);
    try {
      const formData = new FormData();
      formData.append("coding_level", data.coding_level);
      
      // Append each interest individually
      data.interests.forEach(interest => {
        formData.append("interests", interest);
      });
      
      formData.append("self_description", data.self_description);
      formData.append("week_plan", data.week_plan.toString());

      const response = await fetch(`${API_BASE_URL}/api/plan/manual`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to generate plan");
      }

      const result = await response.json();
      onResults(result);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(`Error generating plan: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      onLoading(false);
    }
  };

  const submitResume = async (file: File) => {
    onLoading(true);
    try {
      const formDataObj = new FormData();
      formDataObj.append("file", file);
      formDataObj.append("traits", formData.self_description);
      formDataObj.append("week_plan", formData.week_plan.toString());

      const response = await fetch(`${API_BASE_URL}/api/plan/resume`, {
        method: "POST",
        body: formDataObj,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to analyze resume");
      }

      const result = await response.json();
      onResults(result);
    } catch (error) {
      console.error("Error uploading resume:", error);
      alert(`Error analyzing resume: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      onLoading(false);
    }
  };

  const handleSubmitManual = () => {
    submitManualForm(formData);
  };

  const handleSubmitResume = () => {
    if (file) {
      submitResume(file);
    }
  };

  return (
    <section className="py-8 px-4 ">
      <div className="container mx-auto">
        {activeTab === "resume" ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 border border-gray-700 rounded-xl p-6"
          >
            <div
              className="border-2 border-dashed border-gray-600 rounded-lg p-12 text-center cursor-pointer hover:border-secondary transition-all"
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx"
              />
              {file ? (
                <div className="text-gray-300">
                  <p className="text-lg font-medium">{file.name}</p>
                  <p className="text-sm text-gray-400 mt-2">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="mt-4 text-red-400 hover:text-red-300 transition-colors"
                  >
                    Remove File
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-lg font-medium text-gray-300">
                    Drag & drop your resume here
                  </p>
                  <p className="text-gray-400 mt-2">or click to browse</p>
                  <p className="text-sm text-gray-500 mt-4">
                    Supported formats: PDF, DOC, DOCX
                  </p>
                </div>
              )}
            </div>
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">
                  Additional Traits (optional)
                </label>
                <textarea
                  value={formData.self_description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      self_description: e.target.value,
                    })
                  }
                  rows={2}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-300 focus:border-secondary focus:ring-secondary transition-colors"
                  placeholder="Any additional skills or traits not in your resume..."
                ></textarea>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">
                  Plan Duration (weeks)
                </label>
                <input
                  type="range"
                  min="3"
                  max="10"
                  value={formData.week_plan}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      week_plan: parseInt(e.target.value),
                    })
                  }
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-secondary"
                />
                <div className="flex justify-between text-gray-400 text-sm mt-1">
                  <span>3 weeks</span>
                  <span>{formData.week_plan} weeks</span>
                  <span>10 weeks</span>
                </div>
              </div>

              <motion.button
                onClick={handleSubmitResume}
                disabled={!file}
                whileHover={file ? { scale: 1.02 } : {}}
                whileTap={file ? { scale: 0.98 } : {}}
                className={`w-full py-3 px-4 rounded-lg font-bold transition-all ${
                  file
                    ? "bg-gradient-to-r from-secondary to-emerald-500 hover:from-secondary/90 hover:to-emerald-500/90 text-primary shadow-lg shadow-secondary/20"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
              >
                Analyze Resume
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 border border-gray-700 rounded-xl p-6"
          >
            <div className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2">Coding Level</label>
                <select
                  value={formData.coding_level}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      coding_level: e.target.value as CodingLevel,
                    })
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-300 focus:border-secondary focus:ring-secondary transition-colors"
                >
                  <option value="Basic">Basic</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Other">Other</option>
                </select>
                {formData.coding_level === "Other" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <input
                      type="text"
                      value={formData.custom_level || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          custom_level: e.target.value,
                        })
                      }
                      placeholder="Please specify"
                      className="w-full mt-2 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-300 focus:border-secondary focus:ring-secondary"
                    />
                  </motion.div>
                )}
              </div>

              <div>
                <label className="block text-gray-300 mb-2">
                  Interests (Select all that apply)
                </label>
                <div className="flex flex-wrap gap-3">
                  {[
                    "UI/UX",
                    "Full Stack",
                    "Machine Learning",
                    "Data Science",
                    "Cybersecurity",
                    "Mobile Development",
                    "Game Development",
                    "DevOps",
                    "Cloud Computing",
                    "Embedded Systems",
                    "AI/ML Research",
                    "Web3 / Blockchain",
                    "Creative",
                    "Design",
                    "Animation",
                    "3D Modelling",
                    "Storytelling",
                    "Logical Thinking",
                    "Problem Solving",
                    "Critical Thinking",
                    "Public Speaking",
                    "Team Collaboration",
                    "Project Management",
                    "Other",
                  ].map((interest) => (
                    <motion.button
                      key={interest}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        const interests = [...formData.interests];
                        if (interests.includes(interest as Interest)) {
                          const index = interests.indexOf(interest as Interest);
                          interests.splice(index, 1);
                        } else {
                          interests.push(interest as Interest);
                        }
                        setFormData({ ...formData, interests });
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        formData.interests.includes(interest as Interest)
                          ? "bg-gradient-to-br from-secondary to-blue-500 text-primary shadow-sm shadow-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white border border-gray-600"
                      }`}
                    >
                      {interest}
                    </motion.button>
                  ))}
                </div>
                {formData.interests.includes("Other") && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden mt-3"
                  >
                    <input
                      type="text"
                      value={formData.custom_interest || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          custom_interest: e.target.value,
                        })
                      }
                      placeholder="Please specify your other interests"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-300 focus:border-secondary focus:ring-secondary"
                    />
                  </motion.div>
                )}
              </div>

              <div>
                <label className="block text-gray-300 mb-2">
                  Tell us about yourself
                </label>
                <textarea
                  value={formData.self_description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      self_description: e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-300 focus:border-secondary focus:ring-secondary transition-colors"
                  placeholder="Your current skills, experience, and career goals..."
                ></textarea>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">
                  Plan Duration (weeks)
                </label>
                <input
                  type="range"
                  min="3"
                  max="10"
                  value={formData.week_plan}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      week_plan: parseInt(e.target.value),
                    })
                  }
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-secondary"
                />
                <div className="flex justify-between text-gray-400 text-sm mt-1">
                  <span>3 weeks</span>
                  <span>{formData.week_plan} weeks</span>
                  <span>10 weeks</span>
                </div>
              </div>

              <motion.button
                onClick={handleSubmitManual}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-4 bg-gradient-to-r from-secondary to-purple-500 hover:from-secondary/90 hover:to-purple-500/90 text-primary rounded-lg font-bold shadow-lg shadow-secondary/20 transition-all"
              >
                Generate My Plan
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}