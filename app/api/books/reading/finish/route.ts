import { NextResponse } from "next/server";
import { AxiosError } from "axios";
import { cookies } from "next/headers";
import { api } from "../../../api";

interface RequestBody {
  bookId?: string;
  id?: string;
  page: number;
}

interface BackendErrorResponse {
  message?: string;
}

export async function POST(req: Request) {
  try {
    const body: RequestBody | null = await req.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { message: "Invalid JSON body" },
        { status: 400 },
      );
    }

    const { bookId, id, page } = body;
    const targetBookId = bookId || id;

    if (!targetBookId || typeof page !== "number") {
      return NextResponse.json(
        { message: "Both bookId (or id) and page (number) are required" },
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

    const response = await api.post(
      "/books/reading/finish",
      {
        id: targetBookId,
        page,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return NextResponse.json(response.data, { status: 200 });
  } catch (err) {
    const error = err as AxiosError<BackendErrorResponse>;
    console.error(
      "Error finishing reading session:",
      error.response?.data || error.message,
    );

    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "Internal server error";

    return NextResponse.json({ message }, { status });
  }
}
