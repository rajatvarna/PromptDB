export enum Category {
  ALL = 'All',
  INVESTMENT_RESEARCH = 'Investment Research',
  INDUSTRY_ANALYSIS = 'Industry Analysis',
  COMPANY_OPS = 'Company Operations',
  VALUATION = 'Valuation',
  WRITING = 'Report Writing',
  AUTOMATION = 'Workflow Automation'
}

export interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  category: Category;
  tags: string[];
}

export type SortOrder = 'newest' | 'oldest' | 'az' | 'za';