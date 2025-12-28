import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const base = process.env.baseApi;

// GET /api/jobs/[id] - Get job status
export async function GET(req, { params }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) {
    return NextResponse.json({ message: "No token provided" }, { status: 401 });
  }

  const { id } = await params;
  const url = `${base}/api/v1/jobs/${id}`;

  const res = await fetch(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(data, { status: res.status });
  }

  return NextResponse.json(data);
}
