export interface SocietySimulationRequest {
    productName: string;
    productDescription: string;
    productCost: number;
    exposureMessage: string;
    numberOfTurns: number; // Changed from conversationLength
    demographics: {
      occupation?: string[];
      ageRange?: { min: number; max: number }[];
      gender?: string[];
      incomeRange?: { min: number; max: number }[];
      count: number;
    }[];
  }
  