export interface InterviewResult {
  recommendations: {
    topics_to_focus: string[];
    preparation_tips: string[];
    company_insights: string;
    cheat_sheets: { title: string; url: string }[];
    suggested_practice_platforms: string[];
  };
  mock_questions: {
    question: string;
    options: string[];
    answer: string;
  }[];
}

export interface CandidateInput {
  job_type: string;
  domain: string;
  job_description: string;
  company_name: string;
  company_description: string;
  role_applying_for: string;
  coding_level: string;
  days_until_interview: number;
  resume: File | null;
}

export interface InterviewerInput {
  job_role: string;
  resume: File | null;
}

export type FormMode = 'candidate' | 'interviewer';