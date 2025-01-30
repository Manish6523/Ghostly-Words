import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user = session?.user

    if (!session || !user) {
        return Response.json(
            {
                success: false,
                message: "Unauthorized || not Authenticated"
            }, { status: 401 }
        )
    }
    const userId = user._id;
    const { acceptMessages } = await request.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessages: acceptMessages },
            { new: true }
        )

        if (!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message: 'failed to update user status',
                }, { status: 500 }
            )
        } else {
            return Response.json(
                {
                    success: true,
                    message: 'user status updated successfully || message acceptance',
                    updatedUser: updatedUser
                }, { status: 200 }
            )
        }

    } catch (error) {
        return Response.json(
            {
                success: false,
                message: 'failed to update user status to accept messages'
            }, { status: 500 }
        )

    }
}

export async function GET(request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user = session?.user

    if (!session || !user) {
        return Response.json(
            {
                success: false,
                message: "Unauthorized || not Authenticated"
            }, { status: 401 }
        )
    }

    const userId = user._id;

    try {
        const foundUser = await UserModel.findById(userId)

        if (!foundUser) {
            return Response.json(
                {
                    success: false,
                    message: 'failed to find user',
                }, { status: 404 }
            )
        } else {
            return Response.json(
                {
                    success: true,
                    isAcceptingMessages: foundUser.isAcceptingMessages
                }, { status: 200 }
            )
        }
    } catch (error) {
        console.log('failed to get user status to accept messages')
        return Response.json(
            {
                success: false,
                message: 'failed to fetching user status to accept messages'
            }, { status: 500 }
        )
    }
}

