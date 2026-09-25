import { NextResponse } from "next/server";
import { AxiosError } from "axios";
import { api } from "../../api";
import { cookies } from "next/headers";

interface Book {
  id: string;
  title?: string;
}

interface BackendErrorResponse {
  message?: string;
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const readingId =
      searchParams.get("readingId") || searchParams.get("progressId");
    const bookId = searchParams.get("bookId");

    if (!readingId || !bookId) {
      return NextResponse.json(
        { error: "Missing required parameters: readingId and bookId" },
        { status: 400 },
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const authHeaders = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      await api.get<Book>(`/books/${bookId}`, authHeaders);
    } catch (err) {
      const error = err as AxiosError<BackendErrorResponse>;

      if (error.response?.status === 404) {
        return NextResponse.json({ error: "Book not found" }, { status: 404 });
      }
      if (error.response?.status === 401) {
        return NextResponse.json(
          { error: "Unauthorized access" },
          { status: 401 },
        );
      }
      throw err;
    }

    await api.delete("/books/reading", {
      ...authHeaders,
      params: {
        bookId,
        readingId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    const error = err as AxiosError<BackendErrorResponse>;
    console.error("Error deleting reading session:", error);

    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "Internal server error";

    return NextResponse.json({ error: message }, { status });
  }
}
