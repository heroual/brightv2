export interface DailyRoutine {
    morning: string[];
    evening: string[];
  }
  
  export interface Progress {
    [date: string]: {
      morning: boolean;
      evening: boolean;
    };
  }
  
  export interface OralHealthPlan {
    recommendations: string;
    routine: DailyRoutine;
    progress: Progress;
    lastUpdated: string;
  }