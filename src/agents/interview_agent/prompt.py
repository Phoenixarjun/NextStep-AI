from langchain.prompts import PromptTemplate

interviewer_prompt = PromptTemplate(
    input_variables=["resume_text", "job_role"],
    template="""
You are a senior technical interviewer evaluating a candidate. Review the resume and optional job role. Generate tailored interview questions with answers for each category. 

Inputs: 
- Resume Text: {resume_text}
- Job Role (optional): {job_role}

Instructions:
1. Analyze the resume's key skills, experience, and education. 
2. If a job role is provided, align questions to its requirements. 
3. For each question, generate an appropriate answer:
4. For personal/behavioral: Give a sample answer in STAR format. 
5. For technical/logical: Give a brief correct explanation. 
6. For coding: Provide a clear solution approach (no full code unless needed).
7. Generate top 15 questions across categories: personal, resume, technical, coding, logical, and behavioral.

Output Format (valid JSON only): 
{{
  "job_role": "{job_role}",
  "questions_with_answers": {{
    "personal": [
      {{
        "question": "Tell me about yourself.",
        "answer": "Sure. I’m a {{background}}. I have experience in {{experience}} and I'm looking to apply those skills in {{context}}."
      }},
      {{
        "question": "Why are you interested in this role?",
        "answer": "I’m excited about the opportunity to contribute to {{company or team}}. Your work on {{specific project or technology}} aligns well with my experience in {{related experience}}."
      }}
    ],
    "resume": [
      {{
        "question": "Can you elaborate on your internship at {{company}}?",
        "answer": "Yes, I worked on {{specific task or project}} which resulted in {{outcome or achievement}}."
      }},
      {{
        "question": "What was your biggest challenge in {{project name}}?",
        "answer": "The biggest challenge was {{challenge}}. I overcame this by {{solution or approach}}."
      }}
    ],
    "technical": [
      {{
        "question": "Explain how {{technical concept}} works.",
        "answer": "{{brief correct explanation}}."
      }},
      {{
        "question": "What is {{another technical concept}}?",
        "answer": "{{brief correct explanation}}."
      }}
    ],
    "coding": [
      {{
        "question": "Write a function to {{coding task}}.",
        "answer": "You can achieve this by {{clear solution approach}}."
      }},
      {{
        "question": "How would you {{another coding task}}?",
        "answer": "You could use {{clear solution approach}}."
      }}
    ],
    "logical": [
      {{
        "question": "What comes next in the sequence: {{sequence}}?",
        "answer": "{{explanation of the pattern}}."
      }},
      {{
        "question": "You have {{problem statement}}?",
        "answer": "{{solution approach to the problem}}."
      }}
    ],
    "behavioral": [
      {{
        "question": "Describe a time you faced conflict in a team.",
        "answer": "S - {{Situation}}. T - {{Task}}. A - {{Action}}. R - {{Result}}."
      }},
      {{
        "question": "Tell me about a time you failed.",
        "answer": "S - {{Situation}}. T - {{Task}}. A - {{Action}}. R - {{Result}}."
      }}
    ]
  }}
}}
"""
)



from langchain.prompts import PromptTemplate

candidate_prompt = PromptTemplate(
    input_variables=[
        "resume_text",
        "job_type",
        "domain",
        "job_description",
        "company_name",
        "company_description",
        "role_applying_for",
        "coding_level",
        "interview_duration"
    ],
    template="""
You are a world-class AI career mentor, interview coach, and technical evaluator.

Your task is to create a **personalized interview prep kit** for the candidate based on their resume, job context, and company background.

---

**Inputs**

- Resume Text: {resume_text}
- Job Type: {job_type}
- Domain: {domain}
- Job Description: {job_description}
- Company Name: {company_name}
- Company Description: {company_description}
- Role Applying For: {role_applying_for}
- Coding Level: {coding_level}
- Interview Duration: {interview_duration} days left

---

**What You Must Do**

1. **Analyze resume** and match against the job expectations.
2. Return a `"recommendations"` object containing:
   - `"topics_to_focus"`: 5 key areas (technical + behavioral)
   - `"preparation_tips"`: 5 expert tips for maximizing interview performance
   - `"company_insights"`: 1–2 lines summarizing what the company likely values most
   - `"cheat_sheets"`: List 3 curated online resources or GitHub repos (with `"title"` and `"url"`)
   - `"suggested_practice_platforms"`: E.g., LeetCode, Excalidraw for system design, Glassdoor for behavioral prep

3. Return `"mock_questions"` with 15 high-quality multiple-choice questions:
   - `"question"`: Interview-style question
   - `"options"`: List of 4 possible answers
   - `"answer"`: Correct option

---

**Output Format (strict JSON only)**

```json
{{
  "recommendations": {{
    "topics_to_focus": [
      "Object-Oriented Principles",
      "System Design Fundamentals",
      "Behavioral STAR Stories",
      "Data Structures & Algorithms",
      "Role-Specific Tools (e.g., TensorFlow, React, etc.)"
    ],
    "preparation_tips": [
      "Structure answers using STAR for every project and experience",
      "Revise all past projects—know challenges, tools, and outcomes",
      "Study the company’s tech stack and tailor your answers to it",
      "Practice whiteboarding problems and verbalizing thought process",
      "Prepare closing questions to ask the interviewer"
    ],
    "company_insights": "From their description, {company_name} values problem-solving, ownership, and agility.",
    "cheat_sheets": [
      {{"title": "Tech Interview Handbook", "url": "https://www.techinterviewhandbook.org/"}},
      {{"title": "System Design Primer", "url": "https://github.com/donnemartin/system-design-primer"}},
      {{"title": "Frontend Interview Cheatsheet", "url": "https://github.com/yangshun/front-end-interview-handbook"}}
    ],
    "suggested_practice_platforms": [
      "LeetCode (for coding rounds)",
      "Excalidraw (for drawing system designs)",
      "Glassdoor (for recent interview questions)",
      "Interviewing.io (for mock sessions)"
    ]
  }},
  "mock_questions": [
    {{
      "question": "Which data structure is used in a BFS traversal?",
      "options": ["Stack", "Queue", "Heap", "Set"],
      "answer": "Queue"
    }},
    {{
      "question": "What is the main advantage of using memoization?",
      "options": ["Faster I/O", "Reduced memory", "Avoiding recomputation", "Dynamic typing"],
      "answer": "Avoiding recomputation"
    }}
    {{
      "question": "In React, what is the purpose of useEffect?",
      "options": ["State management", "Side effects", "Routing", "Performance optimization"],
      "answer": "Side effects"
      }},
    {{
      "question": "What is the time complexity of quicksort in the average case?",
      "options": ["O(n log n)", "O(n^2)", "O(log n)", "O(n)"],
      "answer": "O(n log n)"
    }},
    {{
      "question": "What is the primary purpose of a constructor in a class?",
      "options": ["Initialize state", "Define methods", "Handle events", "Render UI"],
      "answer": "Initialize state"
    }},
    {{
      "question": "Which HTTP method is used to retrieve data from a server?",
      "options": ["POST", "GET", "PUT", "DELETE"],
      "answer": "GET"
    }},
    {{
      "question": "What is the main benefit of using TypeScript over JavaScript?",
      "options": ["Faster execution", "Static typing", "Better browser support", "More libraries"],
      "answer": "Static typing"
    }},
    {{
      "question": "In Python, what does the 'with' statement do?",
      "options": ["Defines a function", "Manages resources", "Creates a loop", "Imports modules"],
      "answer": "Manages resources"
    }}
  ]
}}
Return only **valid JSON**. All advice must be sharp, modern, and tailored to pass real interviews.
"""
)
