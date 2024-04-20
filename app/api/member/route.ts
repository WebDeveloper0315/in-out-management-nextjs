import {connectDB} from "@/config/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { validateJWT } from "@/helpers/validateJWT";
import bcrypt from "bcryptjs";

connectDB();

export async function POST(request: NextRequest) {
    try {
        await validateJWT(request);
        const { searchParams } = new URL(request.url);
        const isGetData = searchParams.get("getData");
        const delete_id = searchParams.get("delete");
        const edit_id = searchParams.get("edit")

        if(isGetData)
        {
            const userData = await User.find({ name: { $ne: "admin" } });

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

            console.log(userData);

            const userTableData = userData.map((oneData: any, index: any) => {
                return {
                    key: oneData._id,
                    no: index + 1,
                    name: oneData.name,
                    id: oneData.id,
                    password: oneData.password,
                    gender: oneData.gender? "man": "woman",
                    birth: oneData.birth,
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
        if(delete_id){
            const deletionResult = await User.deleteOne({ _id: delete_id });
            if (deletionResult.deletedCount === 1) {
                return NextResponse.json(
                    {
                        message: "User deleted successfully",
                    },
                    {
                        status: 200,
                    }
                );
            } else {
                return NextResponse.json(
                    {
                        message: "User not found or not deleted",
                    },
                    {
                        status: 404,
                    }
                );
            }
        }
        if(edit_id) {
            const reqBody = await request.json()

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(reqBody.password, salt);
            reqBody.password = hashedPassword;

            

        }

        
    } catch (error:any) {
        console.log("Error Occured");
    }
}

// export async function PUT(request: NextRequest) {
    
// }