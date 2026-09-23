import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api } from "../../api";
import { isAxiosError } from "axios";
import { logErrorResponse } from "../../_utils/utils";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const statusParam = req.nextUrl.searchParams.get("status");
    const status = statusParam ? Number(statusParam) : undefined;

    const apiRes = await api.get("/books/own", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        ...(status !== undefined && !isNaN(status) && { status }),
      },
    });

    return NextResponse.json(apiRes.data, { status: apiRes.status });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      console.error("Backend error (Own books):", error.response?.data);
      return NextResponse.json(
        {
          error: error.message || "Fetching own books failed",
          response: error.response?.data,
        },
        { status: error.response?.status || 500 },
      );
    }

    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
