import { NextResponse } from "next/server";
import { exchangeCodeForTokens, redirectUri } from "@/lib/googleHealth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  
  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  const host = url.host;
  const protocol = request.headers.get("x-forwarded-proto") || url.protocol.replace(":", "");
  const baseUri = `${protocol}://${host}`;
  const redirect = redirectUri(baseUri);

  try {
    const tokens = await exchangeCodeForTokens(code, redirect);
    return NextResponse.json({
      message: "Success! Save the refresh token in your environment variables as GOOGLE_HEALTH_REFRESH_TOKEN.",
      refresh_token: tokens.refresh_token,
      // We also output the rest of the payload for debugging if needed
      ...tokens
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
