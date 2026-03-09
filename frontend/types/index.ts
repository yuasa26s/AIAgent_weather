export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  sessionId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

export type OutfitRecommendationRequest = {
  uuid: string;
  latitude: number;
  longitude: number;
  date: string;
};

export type OutfitRecommendationResponse = {
  temperature: number;
  weather: string;
  outfit_recommendation: ChatMessage;
};
