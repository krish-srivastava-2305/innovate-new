import { DBConnect } from "@/libs/DBConnect";
import userModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
    try {
        DBConnect()
        const { email } = await req.json()
        if(!email) return NextResponse.json({error: "Please provide an email"}, {status: 400})
        const user = await userModel.findOne({email})
        if(!user) return NextResponse.json({error: "User not found"}, {status: 400})
        user.passwordRecoveryCode = Math.floor(Math.random()*1000000)
        user.passwordRecoveryCodeExpiry = Date.now() + 360000
        const passwordRecoveryCodeUpdated = await user.save()
        return NextResponse.json({message: "Code Generated", passwordRecoveryCodeUpdated}, {status: 200})

    } catch (error) {
        console.error("Server Error: ", error)
        return NextResponse.json({error: error}, {status: 500})
    }
}