import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/config/dbConfig";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";

connectDB();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    console.log("body in register api => ", reqBody);

    const user = await User.findOne({ name: reqBody.name });

    if (user) {
      throw new Error("User already exists");
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(reqBody.password, salt);
    reqBody.password = hashedPassword;

    // create user
    const newUser = new User({
      name: reqBody.name,
      password: reqBody.password,
      DOB: new Date(1990, 0, 1),
      gender: true,
      id: "khc0315",
      role: "admin",
      image: "sdf"
    });

    await newUser.save();
    

    return NextResponse.json({ message: "User Created Success" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
