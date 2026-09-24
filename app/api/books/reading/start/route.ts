import { NextResponse } from "next/server";
import { AxiosError } from "axios";
import { api } from "../../../api";

interface ProgressItem {
  id?: string;
  status: string;
  startPage?: number;
  startReading?: string;
}

interface Book {
  id: string;
  totalPages: number;
  status: "unread" | "in-progress" | "done";
  progress?: ProgressItem[];
}

interface RequestBody {
  bookId: string;
  page: number;
}

interface BackendErrorResponse {
  message?: string;
}

export async function POST(req: Request) {
  try {
    const body: RequestBody | null = await req.json().catch(() => null);

    if (!body) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { bookId, page } = body;

    if (!bookId || typeof page !== "number") {
      return NextResponse.json(
        { error: "Invalid data: bookId and page (number) are required" },
        { status: 400 },
      );
    }

    let book: Book;
    try {
      const bookResponse = await api.get<Book>(`/books/${bookId}`);
      book = bookResponse.data;
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

    if (page < 1 || page > book.totalPages) {
      return NextResponse.json(
        { error: `Page number must be between 1 and ${book.totalPages}` },
        { status: 400 },
      );
    }

    const activeProgress = book.progress?.find(
      (p: ProgressItem) => p.status === "active",
    );

    if (activeProgress) {
      return NextResponse.json(
        { error: "You already have an active reading session" },
        { status: 400 },
      );
    }

    if (book.status === "unread") {
      await api.patch(`/books/${bookId}`, { status: "in-progress" });
    }

    const startSessionResponse = await api.post("/books/reading/start", {
      bookId,
      page,
    });

    return NextResponse.json(startSessionResponse.data, { status: 201 });
  } catch (err) {
    const error = err as AxiosError<BackendErrorResponse>;
    console.error("Error starting reading session:", error);

    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "Internal server error";

    return NextResponse.json({ error: message }, { status });
  }
}
