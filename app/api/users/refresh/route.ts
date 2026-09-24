import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api } from "../../api";
import { isAxiosError } from "axios";
import { logErrorResponse } from "../../_utils/utils";
import { SignupResponse } from "@/types/auth";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json({ error: "No refresh token" }, { status: 401 });
    }

    const apiRes = await api.get<SignupResponse>("/users/current/refresh", {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    if (apiRes.data && apiRes.data.token && apiRes.data.refreshToken) {
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

      try {
        const userRes = await api.get("/users/current", {
          headers: {
            Authorization: `Bearer ${apiRes.data.token}`,
          },
        });

        return NextResponse.json(
          {
            email: userRes.data.email,
            name: userRes.data.name,
          },
          { status: 200 },
        );
      } catch (userError) {
        return NextResponse.json(
          {
            email: apiRes.data.email || "",
            name: apiRes.data.name || "",
          },
          { status: 200 },
        );
      }
    }

    return NextResponse.json(
      { error: "Invalid refresh token" },
      { status: 401 },
    );
  } catch (error) {
    const cookieStore = await cookies();
    cookieStore.delete("token");
    cookieStore.delete("refreshToken");

    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.response?.data?.message || "Invalid refresh token" },
        { status: error.response?.status || 401 },
      );
    }

    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
