import jwt from "jsonwebtoken";
import { comparePassword } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { errorResponse, optionsResponse, successResponse } from "@/lib/utils";

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function buildCookie(value, maxAge) {
  const isProd = process.env.NODE_ENV === "production";
  const securePart = isProd ? " Secure;" : "";
  const sameSitePart = isProd ? " SameSite=None;" : " SameSite=Lax;";
  return `token=${value}; HttpOnly; Path=/; Max-Age=${maxAge};${sameSitePart}${securePart}`;
}

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

    const response = successResponse(
      {
        user: {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
      200,
    );

    response.headers.set("Set-Cookie", buildCookie(token, TOKEN_MAX_AGE));
    return response;
  } catch (error) {
    console.log(error);
    return errorResponse("Login failed", 500);
  }
}
