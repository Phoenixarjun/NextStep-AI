# 🚀 NextStep AI — Your Personalized Career Copilot

![Next.js](https://img.shields.io/badge/Next.js-13-blue?logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.3-blue?logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?logo=typescript)
![Python](https://img.shields.io/badge/Python-3.11-yellow?logo=python)
![LangChain](https://img.shields.io/badge/LangChain-Framework-green?logo=python)
![LangGraph](https://img.shields.io/badge/LangGraph-Orchestration-orange)
![RAG](https://img.shields.io/badge/RAG-Augmented-blueviolet)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-teal?logo=fastapi)
![AI Agents](https://img.shields.io/badge/AI--Agents-MultiAgent-red)
![Gemini](https://img.shields.io/badge/Gemini-Google--AI-purple?logo=google)

---

## 🧠 What is NextStep AI?

**NextStep AI** is an intelligent, agent-based platform designed to empower job seekers, students, and career professionals. It automates resume optimization, job matching, interview simulation, learning path planning, and content generation using LLMs, LangGraph, and dynamic APIs — all orchestrated with real-time reasoning and RAG.

---

## 🧩 Agent System Overview

### 📚 Planner Agent
**Purpose:**  
Creates a **customized learning roadmap** based on your current skills, career goal, and preferred timeline.

**What It Delivers:**  
- AI-curated course recommendations  
- Project suggestions  
- Skill milestones and certification paths  
- GitHub portfolio ideas

---

### 📄 Resume Agent
**Purpose:**  
Reviews and optimizes resumes for both **ATS systems and human readability**.

**What It Delivers:**  
- Structural and formatting analysis  
- Role-based keyword suggestions  
- Personalization feedback  
- ATS compliance tips

---

### 🎙️ Interview Agent
**Purpose:**  
Simulates **real-world technical and behavioral interviews**, providing feedback and context-aware questions.

**What It Delivers:**  
- STAR format answers  
- Technical Q&A (role-specific)  
- Real-time feedback  
- Voice-based simulation (optional)

---

### 🔍 Job Match Agent
**Purpose:**  
Scrapes real-time job listings and ranks them against your **skills, preferences, and readiness**.

**What It Delivers:**  
- Fit score per job  
- Skill gap and improvement advice  
- Real-time job cards with source links  
- Suggested tweaks to resume or planner

---

### ✍️ Content Agent
**Purpose:**  
Generates AI-enhanced content for your professional platforms like:

- **LinkedIn** posts (projects, wins, certificates)  
- **GitHub** README.md files (markdown-rich)  
- **Twitter** threads or announcements  
- **Custom** content (blogs, announcements, etc.)

**What It Delivers:**  
- Audience-tailored tone  
- Proper formatting + hashtags  
- Rich markdown (for GitHub)  
- Ready-to-publish content

---

## ⚙️ Tech Stack Breakdown

| Technology      | Usage |
|----------------|--------|
| **Next.js**     | Frontend framework with dynamic routing, SSR |
| **Tailwind CSS**| For sleek, responsive UI styling |
| **TypeScript**  | Type-safe frontend development |
| **Python**      | Core backend + AI logic |
| **FastAPI**     | RESTful API server |
| **LangChain**   | LLM tool abstraction and agent interface |
| **LangGraph**   | Multi-agent orchestration & event-driven flows |
| **RAG**         | Document-based contextual generation |
| **Gemini Pro**  | LLM used for summarization and generative reasoning |
| **GitPython**   | GitHub repo cloning & file parsing |
| **Framer Motion** | UI animation layer |
| **React Markdown + Shiki** | Render markdown content beautifully |

---

## 🔐 Environment Variables

Add the following to your `.env` file in the backend root:

```env
GOOGLE_API_KEY=your_google_gemini_api_key
SERP_API_KEY=your_serpapi_key
TAVILY_API_KEY=your_tavily_key
````

---

## 🖼️ Screenshots

<img width="1896" height="904" alt="Screenshot 2025-07-12 222954" src="https://github.com/user-attachments/assets/9a2a7922-df95-416b-bfdc-064f75a8cfb2" />

<img width="1901" height="910" alt="Screenshot 2025-07-12 223059" src="https://github.com/user-attachments/assets/bb735ef3-6829-4244-9af3-75acf4bc607a" />



---

## 🚀 How to Run

```bash
# 1. Clone the repository
git clone https://github.com/Phoenixarjun/NextStep-AI/
cd NextStep-AI

# 2. Start Frontend (Next.js)
cd nextstep_app
npm install
npm run dev

# 3. Start Backend (FastAPI)
pip install -r requirements.txt
uvicorn app:app --reload
```

Make sure `.env` is properly configured.

---

## ❤️ Made With Passion

> Created by **Naresh B A**
> Full Stack Developer & ML Enthusiast
> 🔗 [LinkedIn](https://www.linkedin.com/in/naresh-b-a-1b5331243)

---

> 🧠 Powered by LangGraph · Supercharged by Gemini Pro · Designed for the future of work.

