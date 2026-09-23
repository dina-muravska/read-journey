import { isAxiosError } from "axios";
import { logErrorResponse } from "../../_utils/utils";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api } from "../../api";

type Props = {
  params: Promise<{ bookId: string }>;
};

export async function GET(request: NextRequest, { params }: Props) {
  const { bookId } = await params;
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const apiRes = await api.get(`/books/${bookId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json(apiRes.data, { status: apiRes.status });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        {
          error: error.message || `Fetching book by ID ${bookId} failed`,
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
