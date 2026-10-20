import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { errorResponse, optionsResponse, successResponse } from "@/lib/utils";

export async function OPTIONS() {
  return optionsResponse();
}

export async function GET(request, { params }) {
  try {
    const { user_id } = await params;
    if (!ObjectId.isValid(user_id)) {
      return errorResponse("Invalid user id", 400);
    }
    const db = await getDb();
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(user_id) }, { projection: { password: 0 } });
    if (!user) {
      return errorResponse("User not found", 404);
    }
    return successResponse({ ...user, _id: user._id.toString() }, 200);
  } catch (error) {
    console.log(error);
    return errorResponse("Failed to fetch user", 500);
  }
}
