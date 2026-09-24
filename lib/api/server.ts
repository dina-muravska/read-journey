import { cookies } from "next/headers";
import type {
  FetchRecommendedParams,
  FetchRecommendedResponse,
} from "@/types/book";

export const fetchRecommendedServer = async (
  params: FetchRecommendedParams,
): Promise<FetchRecommendedResponse> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("Not authenticated");
  }

  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.title) query.set("title", params.title);
  if (params.author) query.set("author", params.author);

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_API_URL ||
    "https://readjourney.b.goit.study/api";

  const res = await fetch(`${backendUrl}/books/recommend?${query.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch recommended books on server");
  }

  return res.json();
};
