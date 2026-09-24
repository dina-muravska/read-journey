import { NextResponse } from "next/server";
import { AxiosError } from "axios";
import { api } from "../../../api";

interface ProgressItem {
  id: string;
  status: string;
  startPage: number;
  finishPage?: number;
  startReading?: string;
  finishReading?: string;
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

    const activeProgress = book.progress?.find(
      (p: ProgressItem) => p.status === "active",
    );

    if (!activeProgress) {
      return NextResponse.json(
        { error: "No active reading session found" },
        { status: 400 },
      );
    }

    if (page <= activeProgress.startPage) {
      return NextResponse.json(
        {
          error: `Finish page must be greater than start page (${activeProgress.startPage})`,
        },
        { status: 400 },
      );
    }

    if (page > book.totalPages) {
      return NextResponse.json(
        {
          error: `Finish page cannot exceed total pages (${book.totalPages})`,
        },
        { status: 400 },
      );
    }

    const finishSessionResponse = await api.post("/books/reading/finish", {
      bookId,
      page,
    });

    const isCompleted = page === book.totalPages;
    if (isCompleted) {
      await api.patch(`/books/${bookId}`, { status: "done" });
    }

    return NextResponse.json({
      progress: finishSessionResponse.data,
      isCompleted,
    });
  } catch (err) {
    const error = err as AxiosError<BackendErrorResponse>;
    console.error("Error finishing reading session:", error);

    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "Internal server error";

    return NextResponse.json({ error: message }, { status });
  }
}
