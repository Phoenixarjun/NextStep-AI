export type CodingLevel = 'Basic' | 'Intermediate' | 'Advanced' | 'Other';
export type Interest = 'UI/UX' | 'Full Stack' | 'ML' | 'Data' | 'Other';

export interface PlannerFormData {
  coding_level: CodingLevel;
  custom_level?: string;
  interests: Interest[];
  custom_interest?: string;
  self_description: string;
  week_plan: number;
}

export interface RoadmapWeek {
  week: number;
  focus_goal: string;
  concepts: string[];
  resources: { name: string; url: string }[];
  mini_project: string;
  tips: string[];
}

export interface PlannerResults {
  domain: string;
  summary?: string;
  roadmap: RoadmapWeek[];
}