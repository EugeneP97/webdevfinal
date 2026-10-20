import { verifyJWT } from "@/lib/auth";
import { errorResponse, optionsResponse, successResponse } from "@/lib/utils";

export async function OPTIONS() {
  return optionsResponse();
}

export async function GET(request) {
  const user = verifyJWT(request);
  if (!user) {
    return errorResponse("Unauthorized", 401);
  }
  return successResponse({ user }, 200);
}
