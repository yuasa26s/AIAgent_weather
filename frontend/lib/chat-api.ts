//エンドポイント単位。　エンドポイント増えたらここに追加していく

import { apiClient } from "./api-client";
import {
  OutfitRecommendationRequest,
  OutfitRecommendationResponse,
} from "@/types";

export const postOutfitRecommendation = (body: OutfitRecommendationRequest) => {
  return apiClient<OutfitRecommendationResponse>("/api/v1/outfit/outfit-recommendation", {
    method: "POST",
    body: JSON.stringify(body),
  });
};
