"use client";
import { useState, useRef, ChangeEvent } from "react";
import { FiUpload, FiX, FiChevronDown } from "react-icons/fi";

const API_BASE_URL = "http://localhost:8000";

export default function InterviewAgentForm({
  onResults,
  onLoading,
  onModeChange,
}: {
  onResults: (results: any) => void;
  onLoading: (isLoading: boolean) => void;
  onModeChange: (mode: 'candidate' | 'interviewer') => void;
}) {
  const [mode, setMode] = useState<'candidate' | 'interviewer'>('candidate');
  const [file, setFile] = useState<File | null>(null);
  const [showOtherJobType, setShowOtherJobType] = useState(false);
  const [showOtherDomain, setShowOtherDomain] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const jobTypes = ["Full Time", "Part Time", "Internship", "Contract", "Other"];
  const domains = [
    "Machine Learning",
    "Frontend Development",
    "Backend Development",
    "Full Stack Development",
    "Data Science",
    "DevOps",
    "Other"
  ];
  const codingLevels = ["Beginner", "Intermediate", "Advanced", "Expert", "Other"];

  const [candidateForm, setCandidateForm] = useState({
    job_type: "Full Time",
    other_job_type: "",
    domain: "Machine Learning",
    other_domain: "",
    job_description: "",
    company_name: "",
    company_description: "",
    role_applying_for: "",
    coding_level: "Intermediate",
    other_coding_level: "",
    days_until_interview: 7
  });

  const [interviewerForm, setInterviewerForm] = useState({
    job_role: "",
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleCandidateChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCandidateForm(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'job_type') {
      setShowOtherJobType(value === "Other");
    }
    if (name === 'domain') {
      setShowOtherDomain(value === "Other");
    }
  };

  const switchMode = (selectedMode: 'candidate' | 'interviewer') => {
  setMode(selectedMode);
  onModeChange(selectedMode); // 👈 Notify parent
};


  const handleInterviewerChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInterviewerForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Please upload your resume");
      return;
    }
    
    onLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      if (mode === 'candidate') {
        formData.append("job_type", candidateForm.job_type === "Other" ? candidateForm.other_job_type : candidateForm.job_type);
        formData.append("domain", candidateForm.domain === "Other" ? candidateForm.other_domain : candidateForm.domain);
        formData.append("job_description", candidateForm.job_description);
        formData.append("company_name", candidateForm.company_name);
        formData.append("company_description", candidateForm.company_description);
        formData.append("role_applying_for", candidateForm.role_applying_for);
        formData.append("coding_level", candidateForm.coding_level === "Other" ? candidateForm.other_coding_level : candidateForm.coding_level);
        formData.append("days_until_interview", candidateForm.days_until_interview.toString());
        formData.append("mode", "candidate");
      } else {
        formData.append("job_role", interviewerForm.job_role);
        formData.append("mode", "interviewer");
      }

      const response = await fetch(`${API_BASE_URL}/api/interview`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to analyze interview");
      }

      const result = await response.json();
      onResults(result);
    } catch (error) {
      console.error("Error submitting interview form:", error);
      alert(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      onLoading(false);
    }
  };

  return (
    <section className="py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 shadow-xl">
          {/* Mode Tabs */}
          <div className="flex mb-8 border-b border-gray-700">
            <button
              onClick={() => switchMode('candidate')}
              className={`px-4 py-2 font-medium ${mode === 'candidate' ? 'text-white border-b-2 border-secondary' : 'text-gray-400'}`}
            >
              Candidate
            </button>
            <button
              onClick={() => switchMode('interviewer')}
              className={`px-4 py-2 font-medium ${mode === 'interviewer' ? 'text-white border-b-2 border-secondary' : 'text-gray-400'}`}
            >
              Interviewer
            </button>
          </div>


          {/* File Upload Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Upload Your Resume (PDF only)</h2>
            <div
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                file ? "border-emerald-500/50 bg-emerald-500/10" : "border-gray-600 hover:border-secondary bg-gray-900/30"
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf"
              />
              <div className="flex flex-col items-center justify-center space-y-2">
                <FiUpload className={`text-2xl ${file ? "text-emerald-400" : "text-gray-400"}`} />
                {file ? (
                  <>
                    <p className="text-gray-200">{file.name}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                      className="text-sm text-red-400 hover:text-red-300 flex items-center gap-1 mt-2"
                    >
                      <FiX /> Remove
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-gray-300">Drag & drop or click to browse</p>
                    <p className="text-xs text-gray-500">PDF files only</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Form Fields */}
          {mode === 'candidate' ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Candidate Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Job Type */}
                <div>
                  <label className="block text-gray-300 mb-2">Job Type</label>
                  <div className="relative">
                    <select
                      name="job_type"
                      value={candidateForm.job_type}
                      onChange={handleCandidateChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-gray-300 focus:border-secondary appearance-none pr-10"
                    >
                      {jobTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <FiChevronDown className="absolute right-3 top-3.5 text-gray-400" />
                  </div>
                  {showOtherJobType && (
                    <input
                      type="text"
                      name="other_job_type"
                      value={candidateForm.other_job_type}
                      onChange={handleCandidateChange}
                      placeholder="Specify job type"
                      className="w-full mt-2 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-300"
                    />
                  )}
                </div>

                {/* Domain */}
                <div>
                  <label className="block text-gray-300 mb-2">Domain</label>
                  <div className="relative">
                    <select
                      name="domain"
                      value={candidateForm.domain}
                      onChange={handleCandidateChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-gray-300 focus:border-secondary appearance-none pr-10"
                    >
                      {domains.map(domain => (
                        <option key={domain} value={domain}>{domain}</option>
                      ))}
                    </select>
                    <FiChevronDown className="absolute right-3 top-3.5 text-gray-400" />
                  </div>
                  {showOtherDomain && (
                    <input
                      type="text"
                      name="other_domain"
                      value={candidateForm.other_domain}
                      onChange={handleCandidateChange}
                      placeholder="Specify domain"
                      className="w-full mt-2 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-300"
                    />
                  )}
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-gray-300 mb-2">Company Name</label>
                  <input
                    type="text"
                    name="company_name"
                    value={candidateForm.company_name}
                    onChange={handleCandidateChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-gray-300"
                    placeholder="e.g. Google, Amazon"
                  />
                </div>

                {/* Role Applying For */}
                <div>
                  <label className="block text-gray-300 mb-2">Role Applying For</label>
                  <input
                    type="text"
                    name="role_applying_for"
                    value={candidateForm.role_applying_for}
                    onChange={handleCandidateChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-gray-300"
                    placeholder="e.g. Software Engineer"
                  />
                </div>

                {/* Coding Level */}
                <div>
                  <label className="block text-gray-300 mb-2">Coding Level</label>
                  <div className="relative">
                    <select
                      name="coding_level"
                      value={candidateForm.coding_level}
                      onChange={handleCandidateChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-gray-300 focus:border-secondary appearance-none pr-10"
                    >
                      {codingLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                    <FiChevronDown className="absolute right-3 top-3.5 text-gray-400" />
                  </div>
                </div>

                {/* Days Until Interview */}
                <div>
                  <label className="block text-gray-300 mb-2">Days Until Interview</label>
                  <input
                    type="number"
                    name="days_until_interview"
                    value={candidateForm.days_until_interview}
                    onChange={handleCandidateChange}
                    min="1"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-gray-300"
                  />
                </div>
              </div>

              {/* Job Description */}
              <div>
                <label className="block text-gray-300 mb-2">Job Description</label>
                <textarea
                  name="job_description"
                  value={candidateForm.job_description}
                  onChange={handleCandidateChange}
                  rows={4}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-gray-300"
                  placeholder="Paste the job description here..."
                />
              </div>

              {/* Company Description */}
              <div>
                <label className="block text-gray-300 mb-2">Company Description</label>
                <textarea
                  name="company_description"
                  value={candidateForm.company_description}
                  onChange={handleCandidateChange}
                  rows={3}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-gray-300"
                  placeholder="Brief description about the company..."
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Interviewer Information</h2>
              
              <div>
                <label className="block text-gray-300 mb-2">Job Role</label>
                <input
                  type="text"
                  name="job_role"
                  value={interviewerForm.job_role}
                  onChange={handleInterviewerChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-gray-300"
                  placeholder="e.g. Senior Software Engineer"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!file}
            className={`w-full mt-8 py-4 px-6 rounded-xl font-bold text-lg transition-all ${
              file
                ? "bg-gradient-to-r from-emerald-800 to-emerald-500 hover:from-secondary/90 hover:to-emerald-500/90 text-white shadow-lg shadow-secondary/20 hover:shadow-secondary/30"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            {file ? "Generate Interview Plan" : "Upload Resume to Continue"}
          </button>
        </div>
      </div>
    </section>
  );
}