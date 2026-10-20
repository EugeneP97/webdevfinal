import { getDb } from "@/lib/mongodb";
import { errorResponse, optionsResponse, successResponse } from "@/lib/utils";

export async function OPTIONS() {
  return optionsResponse();
}

export async function GET() {
  try {
    const db = await getDb();
    const users = await db
      .collection("users")
      .find({}, { projection: { password: 0 } })
      .toArray();
    return successResponse(
      users.map((u) => ({ ...u, _id: u._id.toString() })),
      200,
    );
  } catch (error) {
    console.log(error);
    return errorResponse("Failed to fetch users", 500);
  }
}
