import { ObjectId } from "mongodb";
import { verifyJWT } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { errorResponse, optionsResponse, successResponse } from "@/lib/utils";

const validStatus = ["Open", "Close", "Cancel"];

export async function OPTIONS() {
  return optionsResponse();
}

async function getCourse(db, courseId) {
  if (!ObjectId.isValid(courseId)) return null;
  return db.collection("courses").findOne({ _id: new ObjectId(courseId) });
}

export async function GET(request, { params }) {
  const user = verifyJWT(request);
  if (!user) return errorResponse("Unauthorized", 401);

  try {
    const { course_id } = await params;
    const db = await getDb();
    const course = await getCourse(db, course_id);
    if (!course) return errorResponse("Course not found", 404);

    if (user.role === "Teacher" && course.teacherId !== user.id) {
      return errorResponse("Forbidden", 403);
    }

    if (user.role === "Student" && course.status === "Cancel") {
      return errorResponse("Course not found", 404);
    }

    return successResponse({ ...course, _id: course._id.toString() }, 200);
  } catch (error) {
    console.log(error);
    return errorResponse("Failed to fetch course", 500);
  }
}

export async function PUT(request, { params }) {
  const user = verifyJWT(request);
  if (!user) return errorResponse("Unauthorized", 401);
  if (user.role !== "Teacher") return errorResponse("Forbidden", 403);

  try {
    const { course_id } = await params;
    const db = await getDb();
    const course = await getCourse(db, course_id);
    if (!course) return errorResponse("Course not found", 404);
    if (course.teacherId !== user.id) return errorResponse("Forbidden", 403);

    const body = await request.json();
    const { name, duration, topics, price, maxStudent, status } = body;

    if (status && !validStatus.includes(status)) {
      return errorResponse("Invalid status", 400);
    }

    const update = {};
    if (name !== undefined) update.name = name;
    if (duration !== undefined) update.duration = Number(duration);
    if (topics !== undefined) update.topics = Array.isArray(topics) ? topics : [];
    if (price !== undefined) update.price = Number(price);
    if (maxStudent !== undefined) update.maxStudent = Number(maxStudent);
    if (status !== undefined) update.status = status;
    update.updatedAt = new Date();

    await db
      .collection("courses")
      .updateOne({ _id: new ObjectId(course_id) }, { $set: update });

    const updated = await getCourse(db, course_id);
    return successResponse({ ...updated, _id: updated._id.toString() }, 200);
  } catch (error) {
    console.log(error);
    return errorResponse("Failed to update course", 500);
  }
}

export async function DELETE(request, { params }) {
  const user = verifyJWT(request);
  if (!user) return errorResponse("Unauthorized", 401);
  if (user.role !== "Teacher") return errorResponse("Forbidden", 403);

  try {
    const { course_id } = await params;
    const db = await getDb();
    const course = await getCourse(db, course_id);
    if (!course) return errorResponse("Course not found", 404);
    if (course.teacherId !== user.id) return errorResponse("Forbidden", 403);

    if (course.enrolledStudents && course.enrolledStudents.length > 0) {
      return errorResponse("Cannot delete course with enrolled students", 400);
    }

    await db.collection("courses").deleteOne({ _id: new ObjectId(course_id) });
    return successResponse({ message: "Course deleted" }, 200);
  } catch (error) {
    console.log(error);
    return errorResponse("Failed to delete course", 500);
  }
}
