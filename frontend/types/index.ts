export type ChatRole = "user" | "assistant"

export type ChatMessage = {
  id: string;
  sessionId: string;
  role: ChatRole
  content: string
  createdAt: string
}

export type OutfitRecommendationRequest = {
    sessionId: string
    latitude: number
    longitude: number
    message: string
}

export type OutfitRecommendationResponse = {
    temperature: number
    weather: string
    reply: ChatMessage
}