"use client";
import { motion } from "framer-motion";
import { useRef, useState, ChangeEvent } from "react";
import { FiUpload, FiX, FiChevronDown } from "react-icons/fi";

const API_BASE_URL = "http://localhost:8000";

export default function JobAgentForm({
  onResults,
  onLoading,
}: {
  onResults: (results: any) => void;
  onLoading: (isLoading: boolean) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [showOtherJobType, setShowOtherJobType] = useState(false);
  const [formState, setFormState] = useState({
    job_type: "Full Time",
    other_job_type: "",
    preferred_mode: "Remote",
    city: "",
    job_role: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const jobTypes = ["Full Time", "Part Time", "Internship", "Contract", "Other"];
  const workModes = ["Remote", "Hybrid", "Onsite"];

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

  const handleJobTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormState(prev => ({
      ...prev,
      job_type: value,
      other_job_type: value === "Other" ? prev.other_job_type : ""
    }));
    setShowOtherJobType(value === "Other");
  };

  const handleSubmit = async () => {
    if (!file) return;
    onLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("job_type", formState.job_type === "Other" ? formState.other_job_type : formState.job_type);
      formData.append("mode", formState.preferred_mode); 
      formData.append("city", formState.city);
      formData.append("job_role", formState.job_role);


      const response = await fetch(`${API_BASE_URL}/api/job-match`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to find matching jobs");
      }

      const result = await response.json();
      console.log("Job matching results:", result);
      onResults(result);
    } catch (error) {
      console.error("Error submitting job matching form:", error);
      alert(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      onLoading(false);
    }
  };

  return (
    <section className="py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 shadow-xl"
        >
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Upload Your Resume</h2>
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                file
                  ? "border-emerald-500/50 bg-emerald-500/10"
                  : "border-gray-600 hover:border-secondary bg-gray-900/30"
              }`}
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
              <div className="flex flex-col items-center justify-center space-y-3">
                <FiUpload className={`text-3xl ${
                  file ? "text-emerald-400" : "text-gray-400"
                }`} />
                {file ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                  >
                    <p className="text-lg font-medium text-gray-200">{file.name}</p>
                    <p className="text-sm text-gray-400 mt-1">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                      className="mt-3 w-full text-sm text-center text-red-400 hover:text-red-300 transition-colors flex items-center justify-center gap-1"
                    >
                      <FiX /> Remove File
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <p className="text-lg font-medium text-gray-300">
                      Drag & drop your resume here
                    </p>
                    <p className="text-gray-400 mt-1">or click to browse</p>
                    <p className="text-xs text-gray-500 mt-3">
                      Supported formats: PDF, DOC, DOCX (Max 5MB)
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Job Preferences</h2>
            
            {/* First Row - Job Type and Work Mode */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Job Type Dropdown */}
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Job Type</label>
                <div className="relative">
                  <select
                    value={formState.job_type}
                    onChange={handleJobTypeChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-gray-300 focus:border-secondary focus:ring-secondary appearance-none pr-10"
                  >
                    {jobTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <FiChevronDown className="absolute right-3 top-3.5 text-gray-400" />
                </div>
                {showOtherJobType && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.2 }}
                    className="mt-3"
                  >
                    <input
                      type="text"
                      value={formState.other_job_type}
                      onChange={(e) =>
                        setFormState((prev) => ({
                          ...prev,
                          other_job_type: e.target.value,
                        }))
                      }
                      placeholder="Specify job type"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-300 focus:border-secondary focus:ring-secondary"
                    />
                  </motion.div>
                )}
              </div>

              {/* Work Mode Dropdown */}
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Work Mode</label>
                <div className="relative">
                  <select
                    value={formState.preferred_mode}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        preferred_mode: e.target.value,
                      }))
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-gray-300 focus:border-secondary focus:ring-secondary appearance-none pr-10"
                  >
                    {workModes.map((mode) => (
                      <option key={mode} value={mode}>{mode}</option>
                    ))}
                  </select>
                  <FiChevronDown className="absolute right-3 top-3.5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Second Row - Location and Role */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2 font-medium">City</label>
                <input
                  type="text"
                  value={formState.city}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      city: e.target.value,
                    }))
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-gray-300 focus:border-secondary focus:ring-secondary"
                  placeholder="e.g. San Francisco, New York, etc."
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Job Role</label>
                <input
                  type="text"
                  value={formState.job_role}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      job_role: e.target.value,
                    }))
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-gray-300 focus:border-secondary focus:ring-secondary"
                  placeholder="e.g. Data Analyst, Product Manager, etc."
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.div
              className="pt-4"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <button
                onClick={handleSubmit}
                disabled={!file}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all ${
                  file
                    ? "w-full py-3 px-4 bg-gradient-to-r from-purple-950 to-purple-600 hover:from-secondary/90 hover:to-purple-500/90 text-primary rounded-lg font-bold shadow-lg shadow-secondary/20 transition-all"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
              >
                {file ? (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    Find Matching Jobs
                  </motion.span>
                ) : (
                  "Please Upload a Resume First"
                )}
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}