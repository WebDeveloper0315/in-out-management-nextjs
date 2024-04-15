import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/config/dbConfig";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import { validateJWT } from "@/helpers/validateJWT";

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
      DOB: reqBody.dob,
      gender: reqBody.gender,
      id: reqBody.id,
      role: reqBody.role,
      image: reqBody.imagePath
    });

    await newUser.save();
    

    return NextResponse.json({ message: "User Created Success" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await validateJWT(request);
    const { searchParams } = new URL(request.url);

    const userId = searchParams.get("userId")

    const user = await User.findOne({ userId });

    if(user){
      return NextResponse.json(
        {message: "The user exists", success: true},
        {status: 201}
      )
    }
    return NextResponse.json(
      {message: "The user does exists", success: true},
      {status: 200}
    )
  } catch (error: any) {
    return NextResponse.json(
      {message: error.message}, { status: 500}
    )
  }
}