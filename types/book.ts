export interface RecommendedBook {
  _id: string;
  title: string;
  author: string;
  imageUrl: string;
  totalPages: number;
  recommend: boolean;
}

export interface FetchRecommendedResponse {
  results: RecommendedBook[];
  totalPages: number;
  page: number;
  perPage: number;
}

export interface FetchRecommendedParams {
  page?: number;
  limit?: number;
  author?: string;
  title?: string;
}

export interface BookProgress {
  _id: string;
  startPage: number;
  startReading: string;
  finishPage?: number;
  finishReading?: string;
  speed?: number;
  status: "active" | "inactive";
}

export interface TimeLeftToRead {
  hours: number;
  minutes: number;
  seconds: number;
}

export interface BookDetailsResponse {
  _id: string;
  title: string;
  author: string;
  imageUrl: string;
  totalPages: number;
  status: "in-progress" | "done" | "unread";
  owner: string;
  progress: BookProgress[];
  timeLeftToRead?: TimeLeftToRead;
}

export type ActiveProgress = BookProgress & { status: "active" };
export type InactiveProgress = BookProgress & { status: "inactive" };

export interface BookObject {
  title: string;
  author: string;
  totalPages: number;
}
