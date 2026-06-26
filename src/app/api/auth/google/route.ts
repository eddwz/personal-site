import { NextResponse } from "next/server";
import { consentUrl, redirectUri } from "@/lib/googleHealth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const host = url.host;
  const protocol = request.headers.get("x-forwarded-proto") || url.protocol.replace(":", "");
  const baseUri = `${protocol}://${host}`;
  const redirect = redirectUri(baseUri);
  
  return NextResponse.redirect(consentUrl(redirect));
}
