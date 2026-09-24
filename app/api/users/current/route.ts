import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api } from "../../api";
import { isAxiosError } from "axios";
import { logErrorResponse } from "../../_utils/utils";

interface MeResponse {
  email: string;
  name: string;
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const apiRes = await api.get<MeResponse>("/users/current", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json({
      email: apiRes.data.email,
      name: apiRes.data.name,
    });
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response?.status === 401) {
        const cookieStore = await cookies();
        cookieStore.delete("token");
        cookieStore.delete("refreshToken");

        logErrorResponse(error.response?.data);
        return NextResponse.json(
          { error: "Invalid or expired token" },
          { status: 401 },
        );
      }

      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
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
