import { optionsResponse, successResponse } from "@/lib/utils";

export async function OPTIONS() {
  return optionsResponse();
}

export async function POST() {
  return successResponse({ message: "Logged out" }, 200);
}
