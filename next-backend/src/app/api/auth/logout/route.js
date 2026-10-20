import { optionsResponse, successResponse } from "@/lib/utils";

function clearCookie() {
  const isProd = process.env.NODE_ENV === "production";
  const securePart = isProd ? " Secure;" : "";
  const sameSitePart = isProd ? " SameSite=None;" : " SameSite=Lax;";
  return `token=; HttpOnly; Path=/; Max-Age=0;${sameSitePart}${securePart}`;
}

export async function OPTIONS() {
  return optionsResponse();
}

export async function POST() {
  const response = successResponse({ message: "Logged out" }, 200);
  response.headers.set("Set-Cookie", clearCookie());
  return response;
}
