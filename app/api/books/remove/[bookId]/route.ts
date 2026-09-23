import { isAxiosError } from "axios";
import { logErrorResponse } from "@/app/api/_utils/utils";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api } from "@/app/api/api";

type Props = {
  params: Promise<{ bookId: string }>;
};

export async function DELETE(request: NextRequest, { params }: Props) {
  const { bookId } = await params;

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const apiRes = await api.delete(`/books/remove/${bookId}`, {
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
          error:
            error.response?.data?.message ||
            `Removing book ${bookId} from library failed`,
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
