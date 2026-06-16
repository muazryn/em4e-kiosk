export interface QuizQuestion {
  id: number;
  category: "Security" | "Commodity" | "Paper Money" | "Inflation" | "Exchange Rates";
  question: string;
  options: string[];
  correctAnswerIndex: number;
  childHint: string;
  adultDetail: string;
  pedagogicalGoal: string;
  galleryItemSuggestion: string;
}

export type KioskTheme = 'classic-wood' | 'brushed-steel' | 'royal-vault' | 'digital-hologram' | 'toybox-playground';

export interface DeveloperCodeSnippet {
  filename: string;
  language: string;
  description: string;
  code: string;
}
