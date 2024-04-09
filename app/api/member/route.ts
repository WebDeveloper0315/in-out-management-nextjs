import {connectDB} from "@/config/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";

connectDB();

export async function GET(request: NextRequest) {
    const userData = await User.find();

    if(!userData) {
        return NextResponse.json(
            {
                message: "User data not found!",
                data: "",
            },
            {
                status: 200,
            }
        )
    }

    const userTableData = userData.map((oneData: any, index: any) => {
        return {
            no: index + 1,
            name: oneData.name,
            id: oneData.id,
            password: oneData.password,
            gender: oneData? "man": "woman",
            dob: oneData.dob,
            image: "/api/image?key=" + oneData.image,
            role: oneData.role,
        }
    });

    return NextResponse.json(
        {
            message: "User Table Data fetched successfully",
            data: {userTableData},
        },
        {
            status: 201,
        }
    );
}

export async function PUT(request: NextRequest) {
    
}