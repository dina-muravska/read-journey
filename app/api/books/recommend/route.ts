import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAxiosError } from "axios";
import { nextServer } from "@/lib/api/api";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const page = Number(req.nextUrl.searchParams.get("page") ?? 1);
    const limit = Number(req.nextUrl.searchParams.get("limit") ?? 10);
    const author = req.nextUrl.searchParams.get("author") ?? "";
    const title = req.nextUrl.searchParams.get("title") ?? "";

    const params: Record<string, string | number> = { page, limit };
    if (author) params.author = author;
    if (title) params.title = title;

    const apiRes = await nextServer.get("/books/recommend", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    });

    return NextResponse.json(apiRes.data, { status: apiRes.status });
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Backend error:", error.response?.data);
      return NextResponse.json(
        {
          error: error.message || "Fetching recommended books failed",
          response: error.response?.data,
        },
        { status: error.response?.status || 500 },
      );
    }

    console.error("Internal error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
