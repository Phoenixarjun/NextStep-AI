export type Tone = 
  | "professional"
  | "friendly"
  | "motivational"
  | "technical"
  | "casual"
  | "neutral"
  | "bold"
  | "inspiring";

export type ContentTab = "linkedin" | "github" | "twitter" | "other";

export interface LinkedInInput {
  title: string;
  description: string;
  tone?: Tone;
  achievements?: string[];
  link?: string;
  subcategory?: string;
}

export interface GitHubInput {
  github_url: string;
  description: string;
  tech_stack?: string[];
  tone?: Tone;
}

export interface TwitterInput {
  title: string;
  description: string;
  tone?: Tone;
  hashtags?: string[];
  link?: string;
  subcategory?: string;
}

export interface OtherInput {
  custom_input: string;
  tone?: Tone;
}

export interface ContentAgentFormProps {
  onResults: (results: any) => void;
  onLoading: (loading: boolean) => void;
  contentType: ContentTab;
  setContentType: (type: ContentTab) => void;
}