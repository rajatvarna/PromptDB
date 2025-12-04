export enum Category {
  ALL = 'All',
  INVESTMENT_RESEARCH = 'Investment Research',
  INDUSTRY_ANALYSIS = 'Industry Analysis',
  COMPANY_OPS = 'Company Operations',
  VALUATION = 'Valuation',
  WRITING = 'Report Writing',
  AUTOMATION = 'Workflow Automation'
}

export interface PromptVersion {
  timestamp: number;
  title: string;
  description: string;
  content: string;
  category: Category;
  tags: string[];
}

export interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  category: Category;
  tags: string[];
  rating: number;
  ratingCount: number;
  isCustom?: boolean;
  versions?: PromptVersion[];
}

export type SortOrder = 'newest' | 'oldest' | 'az' | 'za';