import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import mongoose from "mongoose";

export async function POST(request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!session || !user) {
        return new Response(JSON.stringify({
            success: false,
            message: "Unauthorized || not Authenticated"
        }), { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        const userData = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: "$messages" },
            { $sort: { "messages.createdAt": -1 } },
            { $group: { _id: "$_id", messages: { $push: "$messages" } } }
        ]);

        if (!userData || userData.length === 0) {
            return new Response(JSON.stringify({
                success: false,
                message: "User not found"
            }), { status: 404 });
        }

        return new Response(JSON.stringify({
            success: true,
            messages: userData[0].messages
        }), { status: 200 });
    } catch (error) {
        console.error("Error in get-messages Endpoint", error);
        return new Response(JSON.stringify({
            success: false,
            message: "Error in get-messages Endpoint"
        }), { status: 500 });
    }
}
