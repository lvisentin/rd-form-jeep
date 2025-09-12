import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const token = "68c420b374dae10019cbb6a0";
  const url = `https://crm.rdstation.com/api/v1/contacts?email=${encodeURIComponent(
    email
  )}&token=${token}`;

  try {
    const response = await fetch(url, {
      headers: { accept: "application/json" },
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch from CRM" },
      { status: 500 }
    );
  }
}
