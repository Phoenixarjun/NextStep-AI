"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Check, X } from "lucide-react";
import type {
  LinkedInInput,
  GitHubInput,
  TwitterInput,
  OtherInput,
  ContentAgentFormProps,
  ContentTab,
  Tone,
} from "./types";

const API_BASE_URL = "http://localhost:8000";

const toneOptions = [
  { value: "professional", label: "Professional" },
  { value: "friendly", label: "Friendly" },
  { value: "motivational", label: "Motivational" },
  { value: "technical", label: "Technical" },
  { value: "casual", label: "Casual" },
  { value: "neutral", label: "Neutral" },
  { value: "bold", label: "Bold" },
  { value: "inspiring", label: "Inspiring" },
];

const techStackOptions = [
  "JavaScript", "TypeScript", "React", "Next.js", "Node.js",
  "Python", "Django", "Flask", "Java", "Spring",
  "C++", "C#", "Go", "Rust", "Swift",
  "Kotlin", "PHP", "Laravel", "Ruby", "Rails",
  "HTML", "CSS", "SASS", "Tailwind", "Bootstrap",
  "Docker", "Kubernetes", "AWS", "Azure", "GCP",
  "Firebase", "MongoDB", "PostgreSQL", "MySQL", "Redis",
  "GraphQL", "REST", "Git", "GitHub", "GitLab",
  "CI/CD", "Jest", "Cypress", "Selenium"
];

export default function ContentAgentForm({ 
  onResults, 
  onLoading,
  contentType,
  setContentType
}: ContentAgentFormProps) {
  const [activeTab, setActiveTab] = useState<ContentTab>(contentType);
  const [tempAchievement, setTempAchievement] = useState("");
  const [tempTech, setTempTech] = useState("");
  const [tempHashtag, setTempHashtag] = useState("");
  const [customTech, setCustomTech] = useState("");
  const [showCustomTech, setShowCustomTech] = useState(false);

  const [linkedinForm, setLinkedinForm] = useState<LinkedInInput>({
    title: "",
    description: "",
    tone: "professional",
  });

  const [githubForm, setGithubForm] = useState<GitHubInput>({
    github_url: "",
    description: "",
    tech_stack: [],
    tone: "technical",
  });

  const [twitterForm, setTwitterForm] = useState<TwitterInput>({
    title: "",
    description: "",
    tone: "casual",
    hashtags: [],
  });

  const [otherForm, setOtherForm] = useState<OtherInput>({
    custom_input: "",
    tone: "neutral",
  });

  // Sync activeTab with contentType prop
  useEffect(() => {
    setActiveTab(contentType);
  }, [contentType]);

  const handleTabChange = (tab: ContentTab) => {
    setActiveTab(tab);
    setContentType(tab);
  };

  const handleSubmit = async () => {
    onLoading(true);
    try {
      let payload;
      let endpoint = "/api/content";

      switch (activeTab) {
        case "linkedin":
          payload = {
            category: "linkedin",
            linkedin: {
              ...linkedinForm,
              achievements: linkedinForm.achievements || [],
            },
          };
          break;
        case "github":
          payload = {
            category: "github",
            github: {
              ...githubForm,
              tech_stack: githubForm.tech_stack || [],
            },
          };
          break;
        case "twitter":
          payload = {
            category: "twitter",
            twitter: {
              ...twitterForm,
              hashtags: twitterForm.hashtags || [],
            },
          };
          break;
        case "other":
          payload = {
            category: "other",
            other: otherForm,
          };
          break;
        default:
          throw new Error("Invalid content type");
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to generate content");
      }

      const result = await response.json();
      onResults({
        ...result,
        category: activeTab
      });
    } catch (error) {
      console.error("Error:", error);
      onResults({
        error: error instanceof Error ? error.message : String(error)
      });
    } finally {
      onLoading(false);
    }
  };

  const addAchievement = () => {
    if (tempAchievement.trim() && !linkedinForm.achievements?.includes(tempAchievement)) {
      setLinkedinForm({
        ...linkedinForm,
        achievements: [...(linkedinForm.achievements || []), tempAchievement],
      });
      setTempAchievement("");
    }
  };

  const addTech = () => {
    if (tempTech === "other") {
      setShowCustomTech(true);
      return;
    }

    if (tempTech.trim() && !githubForm.tech_stack?.includes(tempTech)) {
      setGithubForm({
        ...githubForm,
        tech_stack: [...(githubForm.tech_stack || []), tempTech],
      });
      setTempTech("");
    }
  };

  const addCustomTech = () => {
    if (customTech.trim() && !githubForm.tech_stack?.includes(customTech)) {
      setGithubForm({
        ...githubForm,
        tech_stack: [...(githubForm.tech_stack || []), customTech],
      });
      setCustomTech("");
      setShowCustomTech(false);
      setTempTech("");
    }
  };

  const addHashtag = () => {
    const hashtag = tempHashtag.startsWith("#") ? tempHashtag : `#${tempHashtag}`;
    if (tempHashtag.trim() && !twitterForm.hashtags?.includes(hashtag)) {
      setTwitterForm({
        ...twitterForm,
        hashtags: [...(twitterForm.hashtags || []), hashtag],
      });
      setTempHashtag("");
    }
  };

  const removeItem = (
    list: "achievements" | "tech_stack" | "hashtags",
    item: string
  ) => {
    if (list === "achievements") {
      setLinkedinForm({
        ...linkedinForm,
        achievements: linkedinForm.achievements?.filter((a) => a !== item),
      });
    } else if (list === "tech_stack") {
      setGithubForm({
        ...githubForm,
        tech_stack: githubForm.tech_stack?.filter((t) => t !== item),
      });
    } else {
      setTwitterForm({
        ...twitterForm,
        hashtags: twitterForm.hashtags?.filter((h) => h !== item),
      });
    }
  };

  const renderTag = (
    item: string,
    list: "achievements" | "tech_stack" | "hashtags",
    colorClass: string
  ) => (
    <motion.div
      key={item}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex items-center ${colorClass} px-3 py-1 rounded-full text-sm`}
    >
      {item}
      <button
        onClick={() => removeItem(list, item)}
        className="ml-2 hover:text-white"
      >
        <X className="w-3 h-3" />
      </button>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-3xl mx-auto bg-white/5 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden shadow-lg"
    >
      <div className="flex border-b border-gray-700 relative">
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-700 z-0" />
        <button
          onClick={() => handleTabChange("linkedin")}
          className={`flex-1 py-4 text-sm font-medium transition-colors relative z-10 ${
            activeTab === "linkedin"
              ? "text-indigo-300 border-b-2 border-indigo-300"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          LinkedIn
        </button>
        <button
          onClick={() => handleTabChange("github")}
          className={`flex-1 py-4 text-sm font-medium transition-colors relative z-10 ${
            activeTab === "github"
              ? "text-yellow-300 border-b-2 border-yellow-300"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          GitHub
        </button>
        <button
          onClick={() => handleTabChange("twitter")}
          className={`flex-1 py-4 text-sm font-medium transition-colors relative z-10 ${
            activeTab === "twitter"
              ? "text-blue-300 border-b-2 border-blue-300"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          Twitter
        </button>
        <button
          onClick={() => handleTabChange("other")}
          className={`flex-1 py-4 text-sm font-medium transition-colors relative z-10 ${
            activeTab === "other"
              ? "text-green-300 border-b-2 border-green-300"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          Other
        </button>
      </div>

      {activeTab === "linkedin" && (
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Subcategory (optional)
            </label>
            <input
              value={linkedinForm.subcategory || ""}
              onChange={(e) =>
                setLinkedinForm({ ...linkedinForm, subcategory: e.target.value })
              }
              placeholder="Project, Certification, Achievement, etc."
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Title*
            </label>
            <input
              value={linkedinForm.title}
              onChange={(e) =>
                setLinkedinForm({ ...linkedinForm, title: e.target.value })
              }
              placeholder="Your post title"
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Description*
            </label>
            <textarea
              value={linkedinForm.description}
              onChange={(e) =>
                setLinkedinForm({ ...linkedinForm, description: e.target.value })
              }
              placeholder="Describe your content"
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-h-[120px]"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Achievements (optional)
            </label>
            <div className="flex gap-2">
              <input
                value={tempAchievement}
                onChange={(e) => setTempAchievement(e.target.value)}
                placeholder="Add an achievement"
                className="flex-1 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={addAchievement}
                disabled={!tempAchievement.trim()}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
            {linkedinForm.achievements?.length ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {linkedinForm.achievements.map((item) =>
                  renderTag(
                    item,
                    "achievements",
                    "bg-indigo-900/30 text-indigo-200"
                  )
                )}
              </div>
            ) : (
              <div className="text-xs text-gray-500 mt-1">
                No achievements added yet
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Link (optional)
            </label>
            <input
              value={linkedinForm.link || ""}
              onChange={(e) =>
                setLinkedinForm({ ...linkedinForm, link: e.target.value })
              }
              placeholder="https://example.com"
              type="url"
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Tone
            </label>
            <div className="relative">
              <select
                value={linkedinForm.tone || "professional"}
                onChange={(e) =>
                  setLinkedinForm({ ...linkedinForm, tone: e.target.value as Tone })
                }
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
              >
                {toneOptions.map((tone) => (
                  <option key={tone.value} value={tone.value}>
                    {tone.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "github" && (
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              GitHub URL*
            </label>
            <input
              value={githubForm.github_url}
              onChange={(e) =>
                setGithubForm({ ...githubForm, github_url: e.target.value })
              }
              placeholder="https://github.com/username/repo"
              type="url"
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Description*
            </label>
            <textarea
              value={githubForm.description}
              onChange={(e) =>
                setGithubForm({ ...githubForm, description: e.target.value })
              }
              placeholder="Describe your project"
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent min-h-[120px]"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Tech Stack (optional)
            </label>
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <select
                    value={tempTech}
                    onChange={(e) => {
                      const value = e.target.value;
                      setTempTech(value);
                      if (value === "other") {
                        setShowCustomTech(true);
                      }
                    }}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent appearance-none"
                  >
                    <option value="">Select a technology</option>
                    {techStackOptions.map((tech) => (
                      <option key={tech} value={tech}>
                        {tech}
                      </option>
                    ))}
                    <option value="other">Other (custom)</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (tempTech) addTech();
                  }}
                  disabled={!tempTech}
                  className="px-4 py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>

              {showCustomTech && (
                <div className="flex gap-2">
                  <input
                    value={customTech}
                    onChange={(e) => setCustomTech(e.target.value)}
                    placeholder="Enter custom technology"
                    className="flex-1 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={addCustomTech}
                    disabled={!customTech.trim()}
                    className="px-4 py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                </div>
              )}

              {githubForm.tech_stack?.length ? (
                <div className="flex flex-wrap gap-2 mt-1">
                  {githubForm.tech_stack.map((item) =>
                    renderTag(item, "tech_stack", "bg-yellow-900/30 text-yellow-200")
                  )}
                </div>
              ) : (
                <div className="text-xs text-gray-500 mt-1">
                  No technologies added yet
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Tone
            </label>
            <div className="relative">
              <select
                value={githubForm.tone || "technical"}
                onChange={(e) =>
                  setGithubForm({ ...githubForm, tone: e.target.value as Tone })
                }
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent appearance-none"
              >
                {toneOptions.map((tone) => (
                  <option key={tone.value} value={tone.value}>
                    {tone.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "twitter" && (
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Subcategory (optional)
            </label>
            <input
              value={twitterForm.subcategory || ""}
              onChange={(e) =>
                setTwitterForm({ ...twitterForm, subcategory: e.target.value })
              }
              placeholder="Announcement, Thread, Poll, etc."
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Title*
            </label>
            <input
              value={twitterForm.title}
              onChange={(e) =>
                setTwitterForm({ ...twitterForm, title: e.target.value })
              }
              placeholder="Your tweet title"
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Description*
            </label>
            <textarea
              value={twitterForm.description}
              onChange={(e) =>
                setTwitterForm({ ...twitterForm, description: e.target.value })
              }
              placeholder="Describe your tweet"
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px]"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Hashtags (optional)
            </label>
            <div className="flex gap-2">
              <input
                value={tempHashtag}
                onChange={(e) => setTempHashtag(e.target.value)}
                placeholder="Add a hashtag (without #)"
                className="flex-1 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={addHashtag}
                disabled={!tempHashtag.trim()}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
            {twitterForm.hashtags?.length ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {twitterForm.hashtags.map((item) =>
                  renderTag(item, "hashtags", "bg-blue-900/30 text-blue-200")
                )}
              </div>
            ) : (
              <div className="text-xs text-gray-500 mt-1">
                No hashtags added yet
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Link (optional)
            </label>
            <input
              value={twitterForm.link || ""}
              onChange={(e) =>
                setTwitterForm({ ...twitterForm, link: e.target.value })
              }
              placeholder="https://example.com"
              type="url"
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Tone
            </label>
            <div className="relative">
              <select
                value={twitterForm.tone || "casual"}
                onChange={(e) =>
                  setTwitterForm({ ...twitterForm, tone: e.target.value as Tone })
                }
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                {toneOptions.map((tone) => (
                  <option key={tone.value} value={tone.value}>
                    {tone.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "other" && (
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Custom Input*
            </label>
            <textarea
              value={otherForm.custom_input}
              onChange={(e) =>
                setOtherForm({ ...otherForm, custom_input: e.target.value })
              }
              placeholder="Enter your custom content request..."
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent min-h-[200px]"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Tone
            </label>
            <div className="relative">
              <select
                value={otherForm.tone || "neutral"}
                onChange={(e) =>
                  setOtherForm({ ...otherForm, tone: e.target.value as Tone })
                }
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
              >
                {toneOptions.map((tone) => (
                  <option key={tone.value} value={tone.value}>
                    {tone.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-6 border-t border-gray-700">
        <button
          onClick={handleSubmit}
          className="w-full px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-lg shadow-lg transition-all hover:shadow-indigo-500/20 active:scale-95"
        >
          Generate Content
        </button>
      </div>
    </motion.div>
  );
}