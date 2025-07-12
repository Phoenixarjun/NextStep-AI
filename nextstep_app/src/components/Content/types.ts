// types.ts
export type Tone =
  | "professional"
  | "friendly"
  | "motivational"
  | "technical"
  | "casual"
  | "neutral"
  | "bold"
  | "inspiring";

export interface LinkedInInput {
  subcategory?: string;
  title: string;
  description: string;
  achievements?: string[];
  link?: string;
  tone?: Tone;
}

export interface GitHubInput {
  github_url: string;
  description: string;
  tech_stack?: string[];
  tone?: Tone;
}

export interface TwitterInput {
  subcategory?: string;
  title: string;
  description: string;
  tone?: Tone;
  link?: string;
  hashtags?: string[];
}

export interface OtherInput {
  custom_input: string;
  tone?: Tone;
}

export interface ContentAgentFormProps {
  onResults: (results: any) => void;
  onLoading: (isLoading: boolean) => void;
}

export type ContentTab = "linkedin" | "github" | "twitter" | "other";