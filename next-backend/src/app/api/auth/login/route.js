import jwt from "jsonwebtoken";
import { comparePassword } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { errorResponse, optionsResponse, successResponse } from "@/lib/utils";

const JWT_SECRET = process.env.JWT_SECRET;

export async function OPTIONS() {
  return optionsResponse();
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return errorResponse("Email and password are required", 400);
    }

    const db = await getDb();
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return errorResponse("Invalid email or password", 401);
    }

    const valid = await comparePassword(password, user.password);
    if (!valid) {
      return errorResponse("Invalid email or password", 401);
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    return successResponse(
      {
        user: {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          role: user.role,
        },
        token,
      },
      200,
    );
  } catch (error) {
    console.log(error);
    return errorResponse("Login failed", 500);
  }
}
