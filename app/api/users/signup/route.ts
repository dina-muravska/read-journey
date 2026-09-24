import { NextRequest, NextResponse } from "next/server";
import { api } from "../../api";
import { isAxiosError } from "axios";
import { logErrorResponse } from "../../_utils/utils";
import { cookies } from "next/headers";
import { SignupResponse } from "@/types/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const apiRes = await api.post<SignupResponse>("/users/signup", body);

    if (apiRes.data && apiRes.data.token && apiRes.data.refreshToken) {
      const cookieStore = await cookies();

      cookieStore.set("token", apiRes.data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
        path: "/",
      });

      cookieStore.set("refreshToken", apiRes.data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      return NextResponse.json(
        {
          email: apiRes.data.email,
          name: apiRes.data.name,
        },
        { status: apiRes.status },
      );
    }

    return NextResponse.json(apiRes.data, { status: apiRes.status });
  } catch (error) {
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
