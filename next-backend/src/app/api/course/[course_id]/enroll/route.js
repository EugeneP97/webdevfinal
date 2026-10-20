import { ObjectId } from "mongodb";
import { verifyJWT } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { errorResponse, optionsResponse, successResponse } from "@/lib/utils";

export async function OPTIONS() {
  return optionsResponse();
}

export async function POST(request, { params }) {
  const user = verifyJWT(request);
  if (!user) return errorResponse("Unauthorized", 401);
  if (user.role !== "Student") return errorResponse("Forbidden", 403);

  try {
    const { course_id } = await params;
    if (!ObjectId.isValid(course_id)) {
      return errorResponse("Invalid course id", 400);
    }

    const db = await getDb();
    const course = await db
      .collection("courses")
      .findOne({ _id: new ObjectId(course_id) });

    if (!course) return errorResponse("Course not found", 404);
    if (course.status !== "Open") {
      return errorResponse("Course is not open for enrollment", 400);
    }
    if (course.enrolledStudents.length >= course.maxStudent) {
      return errorResponse("Course is full", 400);
    }
    if (course.enrolledStudents.some((s) => s.studentId === user.id)) {
      return errorResponse("Already enrolled", 400);
    }

    const result = await db.collection("courses").updateOne(
      {
        _id: new ObjectId(course_id),
        status: "Open",
        "enrolledStudents.studentId": { $ne: user.id },
        $expr: { $lt: [{ $size: "$enrolledStudents" }, "$maxStudent"] },
      },
      {
        $addToSet: {
          enrolledStudents: {
            studentId: user.id,
            studentName: user.username,
            enrolledAt: new Date(),
          },
        },
      },
    );

    if (result.modifiedCount === 0) {
      return errorResponse("Enrollment failed", 400);
    }

    return successResponse({ message: "Enrolled successfully" }, 200);
  } catch (error) {
    console.log(error);
    return errorResponse("Failed to enroll", 500);
  }
}
