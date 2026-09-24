import { NextResponse } from "next/server";
import { AxiosError } from "axios";
import { api } from "../../api";

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
    const progressId = searchParams.get("progressId");
    const bookId = searchParams.get("bookId");

    if (!progressId || !bookId) {
      return NextResponse.json(
        { error: "Missing required parameters: progressId and bookId" },
        { status: 400 },
      );
    }

    try {
      await api.get<Book>(`/books/${bookId}`);
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
      params: {
        bookId,
        readingId: progressId,
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
