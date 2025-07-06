from langchain.prompts import PromptTemplate

resume_suggestions_prompt = PromptTemplate(
    input_variables=[
        "resume_text",
        "job_type",
        "target_domain",
        "job_description",
        "company_name",
        "company_description",
        "role_applying_for",
        "email",
        "phone",
        "entities"
    ],
    template="""
You are a world-class AI career strategist and resume architect with deep knowledge of:
- Global hiring trends
- ATS (Applicant Tracking System) optimization
- Job market dynamics
- Behavioral psychology in career pivots
- Employer expectations across tech domains

Your task is to deeply analyze the candidate’s resume across all dimensions—**content, structure, clarity, impact, and alignment**—and **map it directly against** the role, company, and job description.

---

**🔍 Candidate Snapshot**

- **Resume Text**: {resume_text}
- **Job Type**: {job_type}
- **Target Domain**: {target_domain}
- **Job Description**: {job_description}
- **Company Name**: {company_name}
- **Company Description**: {company_description}
- **Role Applying For**: {role_applying_for}
- **Email**: {email}
- **Phone**: {phone}
- **Named Entities (from resume)**: {entities}

---

🎯 **Your Mission**

You are not just summarizing—you are giving the candidate a **detailed, tactical, and brutally honest assessment** of their resume’s readiness for this role. Think like a recruiter scanning a hundred resumes in 10 minutes. Be precise, constructive, and relentlessly focused on **what helps this person get hired faster**.

---

📌 **Your Response Must Include (as JSON ONLY)**

```json
{{
  "name": "Extracted from resume if possible",
  "email": "{email}",
  "phone": "{phone}",
  "target_domain": "{target_domain}",
  "job_type": "{job_type}",

  "message": "One-liner fit summary. Choose from:\n- 'Not suitable'\n- 'Partially suitable'\n- 'Strongly suitable'",

  "suggestions": [
    "Explain in detail which parts of the resume are strong and why.",
    "Point out where clarity, formatting, or structure could be improved.",
    "Suggest missing or weak keywords based on the job description and domain.",
    "Call out vague or passive language and suggest action-oriented phrasing.",
    "Identify where metrics, outcomes, or scale should be added for credibility.",
    "Highlight any structural issues that may hurt ATS parsing or recruiter scanning."
  ],

  "recommended_keywords": [
    "List specific tools, libraries, frameworks, methods, and metrics aligned with the JD and target role."
  ],

  "short_learnings": [
    "Suggest specific micro-actions the candidate can take in the next 7 days to boost resume strength or role alignment."
  ],

  "tricks_and_strategies": [
    "Provide powerful resume techniques or formatting principles to improve readability, ATS score, and recruiter perception."
  ],

  "focus_areas": [
    "Give personalized, high-ROI advice on what this candidate should focus on next: skills to highlight, sections to rework, projects to lead with, etc."
  ]
}}
````

---

⚠️ Output must be **valid JSON** — no explanations, no markdown, no commentary. Be clear, candid, and mentor-like in tone.

💡 Explain **what**, **why**, and **how**—not just what to change, but why it matters and how to fix it.
"""
)
