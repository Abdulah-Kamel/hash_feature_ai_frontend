import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const c = await cookies();
  const authToken = c.get("authToken");
  const refreshToken = c.get("refreshToken");
  return NextResponse.json({ isAuthenticated: !!authToken, hasRefreshToken: !!refreshToken });
}