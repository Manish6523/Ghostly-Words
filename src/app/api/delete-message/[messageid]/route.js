import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function DELETE(request,{params}) {
    await dbConnect();
    const messageId = params.messageid;
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

    try{
        const updateResult = await UserModel.updateOne(
            {_id: user._id},
            {$pull: {messages: {_id: messageId}}}
        )
        if(updateResult.modifiedCount === 0){
            return Response.json(
                {
                    success: false,
                    message: "Message not found"
                }, { status: 404 }
            )
        }
        return Response.json(
            {
                success: true,
                message: "Message deleted"
            }, { status: 200 }
        )
    } catch(error){
        console.error("Error while deleting route")
        return Response.json(
            {
                success: false,
                message: "error while deleting message"
            }, { status: 500 }
        )   
    }

}