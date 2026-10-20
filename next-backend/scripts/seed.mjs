import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("Please set MONGODB_URI environment variable");
  process.exit(1);
}

const dbName = process.env.MONGODB_DB || "wad_final";

const users = [
  {
    username: "teacher1",
    email: "teacher1@example.com",
    password: "teacher123",
    role: "Teacher",
  },
  {
    username: "teacher2",
    email: "teacher2@example.com",
    password: "teacher123",
    role: "Teacher",
  },
  {
    username: "teacher3",
    email: "teacher3@example.com",
    password: "teacher123",
    role: "Teacher",
  },
  {
    username: "student1",
    email: "student1@example.com",
    password: "student123",
    role: "Student",
  },
  {
    username: "student2",
    email: "student2@example.com",
    password: "student123",
    role: "Student",
  },
  {
    username: "student3",
    email: "student3@example.com",
    password: "student123",
    role: "Student",
  },
];

async function seed() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("users");

    await collection.deleteMany({
      email: { $in: users.map((u) => u.email) },
    });

    const hashedUsers = await Promise.all(
      users.map(async (u) => ({
        ...u,
        password: await bcrypt.hash(u.password, 10),
        createdAt: new Date(),
      })),
    );

    const result = await collection.insertMany(hashedUsers);
    console.log(`Seeded ${result.insertedCount} users`);
    console.log("Login credentials:");
    for (const u of users) {
      console.log(`  ${u.role}: ${u.email} / ${u.password}`);
    }
  } finally {
    await client.close();
  }
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
