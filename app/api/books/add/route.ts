import { isAxiosError } from "axios";
import { logErrorResponse } from "../../_utils/utils";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api } from "../../api";

interface AddBookRequestBody {
  title: string;
  author: string;
  totalPages: number | string;
}

export async function POST(request: NextRequest) {
  try {
    const body: AddBookRequestBody | null = await request
      .json()
      .catch(() => null);

    if (!body || !body.title || !body.author || !body.totalPages) {
      return NextResponse.json(
        { message: "Title, author, and totalPages are required fields" },
        { status: 400 },
      );
    }

    const formattedBody = {
      title: body.title,
      author: body.author,
      totalPages: Number(body.totalPages),
    };

    if (isNaN(formattedBody.totalPages) || formattedBody.totalPages <= 0) {
      return NextResponse.json(
        { message: "totalPages must be a positive number" },
        { status: 400 },
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 },
      );
    }

    const apiRes = await api.post("/books/add", formattedBody, {
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
          message:
            error.response?.data?.message || "Adding book to library failed",
        },
        { status: error.response?.status || 500 },
      );
    }

    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
