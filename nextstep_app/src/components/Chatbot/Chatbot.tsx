"use client";
import { motion } from "framer-motion";
import { useRef, useState, ChangeEvent, FormEvent, useEffect } from "react";
import { FiUpload, FiX, FiSend, FiTrash2, FiStopCircle, FiUser, FiMessageSquare, FiPower, FiExternalLink } from "react-icons/fi";
import Image from "next/image";
const API_BASE_URL = "http://localhost:8000";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  links?: { text: string; url: string }[];
}

export default function Chatbot() {
  const [file, setFile] = useState<File | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [isActive, setIsActive] = useState(true); 
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      setMessages([{
        id: generateId(),
        role: "assistant",
        content: "Hey there! 👋 I'm OmniCoach AI, your friendly guide for all things career, coding, and job-related. Think of me as your personal mentor, ready to help you ace interviews, level up your tech skills, craft a killer resume, and discover exciting job opportunities. How can I help you today?",
        links: []
      }]);
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatMessages", JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 100;
      
      if (isNearBottom) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [messages]);

  const generateId = () => Math.random().toString(36).substring(2, 11);

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

  const handleSubmitMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading || !isActive) return;

    const userMessage = inputMessage;
    setInputMessage("");
    
    const newUserMessage: Message = {
      id: generateId(),
      role: "user",
      content: userMessage,
      links: []
    };
    
    setMessages(prev => [...prev, newUserMessage]);

    const controller = new AbortController();
    setAbortController(controller);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("query", userMessage);
      if (file) {
        formData.append("file", file);
      }

      const response = await fetch(`${API_BASE_URL}/api/chatbot`, {
        method: "POST",
        body: formData,
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error("Failed to get response from AI");
      }

      const result = await response.json();
      
      const newAiMessage: Message = {
        id: generateId(),
        role: "assistant",
        content: result.output,
        links: result.sources?.map((url: string) => ({
          text: url.replace(/https?:\/\/(www\.)?/, '').split('/')[0],
          url: url
        })) || []
      };
      
      setMessages(prev => [...prev, newAiMessage]);
    } catch (error) {
      if (typeof error === "object" && error !== null && "name" in error && 
          (error as { name: string }).name !== 'AbortError') {
        console.error("Error:", error);
        setMessages(prev => [...prev, {
          id: generateId(),
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
          links: []
        }]);
      }
    } finally {
      setIsLoading(false);
      setAbortController(null);
    }
  };

  const handleClearChat = () => {
    setMessages([{
      id: generateId(),
      role: "assistant",
      content: "Hey there! 👋 I'm OmniCoach AI, your friendly guide for all things career, coding, and job-related. Think of me as your personal mentor, ready to help you ace interviews, level up your tech skills, craft a killer resume, and discover exciting job opportunities. How can I help you today?",
      links: []
    }]);
    setFile(null);
    localStorage.removeItem("chatMessages");
  };

  const handleStopGeneration = () => {
    if (abortController) {
      abortController.abort();
    }
  };

  const toggleActive = () => {
    setIsActive(!isActive);
    if (!isActive && isLoading) {
      handleStopGeneration();
    }
  };

  return (
    <section className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-gray-800/50 border border-gray-700 rounded-xl shadow-xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-purple-950 to-purple-600 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 rounded-full p-2">
                <Image
                  src="/Bot.png"
                  alt="OmniCoach Logo"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">OmniCoach AI</h1>
                  <p className="text-purple-200">Your personal career mentor</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleActive}
                  className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-green-600/90 hover:bg-green-500 text-white' 
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                >
                  <FiPower className="text-sm" />
                  <span>{isActive ? 'Active' : 'Inactive'}</span>
                </button>
                <button
                  onClick={handleClearChat}
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                >
                  <FiTrash2 /> Clear Chat
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row h-[70vh]">
            <div className="w-full md:w-1/3 border-r border-gray-700 p-6 bg-gray-900/50">
              <h2 className="text-xl font-bold text-white mb-6">Upload Your Resume</h2>
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  file
                    ? "border-emerald-500/50 bg-emerald-500/10"
                    : "border-gray-600 hover:border-purple-500 bg-gray-900/30"
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
                  <FiUpload
                    className={`text-3xl ${file ? "text-emerald-400" : "text-gray-400"}`}
                  />
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
                        className="mt-3 w-full text-sm text-red-400 hover:text-red-300 transition-colors flex items-center justify-center gap-1"
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
              <div className="mt-6 text-gray-400 text-sm">
                <p>Uploading your resume helps provide personalized career advice.</p>
              </div>
            </div>

            <div className="w-full md:w-2/3 flex flex-col bg-gray-800/30">
              <div 
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-6 space-y-6"
              >
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} gap-3`}
                  >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 ${
                      message.role === "user" 
                        ? "bg-purple-600 text-white" 
                        : "bg-gray-700 text-gray-300"
                    }`}>
                      {message.role === "user" ? <FiUser /> : <FiMessageSquare />}
                    </div>
                    <div
                      className={`max-w-[80%] rounded-xl p-4 ${
                        message.role === "user"
                          ? "bg-purple-600/90 text-white"
                          : "bg-gray-700/80 text-gray-100"
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      {message.links && message.links.length > 0 && (
                        <div className="mt-3">
                          <div className="bg-gray-800/70 border border-gray-700 rounded-lg p-3 shadow-md">
                            <p className="text-sm font-medium mb-2 text-gray-300">Resources:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {message.links.map((link, idx) => (
                                <a
                                  key={idx}
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 p-2 bg-gray-700/50 hover:bg-gray-700 rounded border border-gray-600 transition-colors"
                                >
                                  <FiExternalLink className="flex-shrink-0 text-blue-400" />
                                  <span className="text-blue-400 hover:text-blue-300 text-sm truncate">
                                    {link.text}
                                  </span>
                                </a>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start gap-3"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 text-gray-300 flex items-center justify-center mt-1">
                      <FiMessageSquare />
                    </div>
                    <div className="bg-gray-700/80 text-gray-100 rounded-xl p-4 max-w-[80%]">
                      <div className="flex items-center gap-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                        </div>
                        <span>Thinking...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="border-t border-gray-700 p-4 relative">
                {isLoading && (
                  <button
                    onClick={handleStopGeneration}
                    className="absolute -top-8 right-4 flex items-center gap-1 bg-red-600/90 hover:bg-red-500 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    <FiStopCircle /> Stop
                  </button>
                )}
                <form onSubmit={handleSubmitMessage} className="flex space-x-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask me anything about careers, tech, or your resume..."
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    disabled={isLoading || !isActive}
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isLoading || !isActive}
                    className={`p-3 rounded-lg ${
                      inputMessage.trim() && isActive
                        ? "bg-purple-600 hover:bg-purple-700 text-white"
                        : "bg-gray-700 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <FiSend className="text-xl" />
                  </button>
                </form>
                <div className="text-xs text-gray-500 mt-2 text-center">
                  {file
                    ? "I'll reference your resume in my responses"
                    : "For personalized advice, consider uploading your resume"}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}