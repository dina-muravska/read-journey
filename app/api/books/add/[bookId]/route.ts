import { isAxiosError } from "axios";
import { logErrorResponse } from "../../../_utils/utils";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api } from "../../../api";

type Props = {
  params: Promise<{ bookId: string }>;
};

export async function POST(request: NextRequest, { params }: Props) {
  const { bookId } = await params;

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 },
      );
    }

    const apiRes = await api.post(
      `/books/add/${bookId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return NextResponse.json(apiRes.data, { status: apiRes.status });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        {
          message:
            error.response?.data?.message || `Adding book ID ${bookId} failed`,
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
