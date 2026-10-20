import { verifyJWT } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { errorResponse, optionsResponse, successResponse } from "@/lib/utils";

const validStatus = ["Open", "Close", "Cancel"];

export async function OPTIONS() {
  return optionsResponse();
}

export async function GET(request) {
  const user = verifyJWT(request);
  if (!user) return errorResponse("Unauthorized", 401);

  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();

    let query = {};

    if (user.role === "Teacher") {
      query.teacherId = user.id;
    } else {
      query.status = { $ne: "Cancel" };
    }

    if (q) {
      const regex = { $regex: q, $options: "i" };
      query = {
        ...query,
        $or: [{ name: regex }, { teacherName: regex }],
      };
    }

    const courses = await db
      .collection("courses")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return successResponse(
      courses.map((c) => ({ ...c, _id: c._id.toString() })),
      200,
    );
  } catch (error) {
    console.log(error);
    return errorResponse("Failed to fetch courses", 500);
  }
}

export async function POST(request) {
  const user = verifyJWT(request);
  if (!user) return errorResponse("Unauthorized", 401);
  if (user.role !== "Teacher") return errorResponse("Forbidden", 403);

  try {
    const body = await request.json();
    const { name, duration, topics, price, maxStudent, status } = body;

    if (!name || !duration || !price || !maxStudent || !status) {
      return errorResponse("Missing required fields", 400);
    }

    if (!validStatus.includes(status)) {
      return errorResponse("Invalid status", 400);
    }

    const db = await getDb();
    const newCourse = {
      name,
      duration: Number(duration),
      topics: Array.isArray(topics) ? topics : [],
      price: Number(price),
      maxStudent: Number(maxStudent),
      status,
      teacherId: user.id,
      teacherName: user.username,
      enrolledStudents: [],
      createdAt: new Date(),
    };

    const result = await db.collection("courses").insertOne(newCourse);
    return successResponse(
      { ...newCourse, _id: result.insertedId.toString() },
      201,
    );
  } catch (error) {
    console.log(error);
    return errorResponse("Failed to create course", 500);
  }
}
