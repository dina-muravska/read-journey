import { NextResponse } from "next/server";
import { api } from "../../api";
import { cookies } from "next/headers";
import { isAxiosError } from "axios";
import { logErrorResponse } from "../../_utils/utils";

export async function POST() {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("token")?.value;

    if (token) {
      try {
        await api.post("/users/signout", null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {}
    }

    cookieStore.delete("token");
    cookieStore.delete("refreshToken");

    return NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 },
    );
  } catch (error) {
    try {
      const cookieStore = await cookies();
      cookieStore.delete("token");
      cookieStore.delete("refreshToken");
    } catch (cookieError) {}

    if (isAxiosError(error)) {
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
